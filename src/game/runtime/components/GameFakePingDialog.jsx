import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import MapView, { map } from '../../../map/core/MapView';
import MapDefaultCamera from '../../../map/main/MapDefaultCamera';
import Loader from '../../../common/components/Loader';
import { formatCoordinate } from '../../../common/util/formatter';
import { usePreference } from '../../../common/util/preferences';
import { fromMapCoordinates } from '../../../map/core/mapUtil';
import GameMapGeofences from '../../map/GameMapGeofences';
import GameMapMarkers from '../../map/GameMapMarkers';
import { isValidCoordinate, markerToPosition } from '../../map/gameMapUtils';
import useGameMap from '../hooks/useGameMap';

const MapClickSelector = ({ onSelect }) => {
  const handleClick = useCallback(
    (event) => {
      if (event.defaultPrevented) {
        return;
      }
      const [longitude, latitude] = fromMapCoordinates(event.lngLat.lng, event.lngLat.lat);
      onSelect({ latitude, longitude });
    },
    [onSelect],
  );

  useEffect(() => {
    map.getCanvas().style.cursor = 'crosshair';
    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
      map.getCanvas().style.cursor = '';
    };
  }, [handleClick]);

  return null;
};

const GameFakePingDialog = ({ open, gameId, joker, actionLoading, onClose, onActivate, t }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const coordinateFormat = usePreference('coordinateFormat');
  const { gameMap, loading } = useGameMap(open ? gameId : null);
  const [selectedPosition, setSelectedPosition] = useState(null);

  useEffect(() => {
    if (open) {
      setSelectedPosition(null);
    }
  }, [open, joker?.id]);

  const selectedMarkers = useMemo(
    () =>
      selectedPosition
        ? [
            {
              source: 'fake_ping',
              memberId: `fake-${joker?.id || 'new'}`,
              displayName: t('gameFakePingLocation'),
              latitude: selectedPosition.latitude,
              longitude: selectedPosition.longitude,
            },
          ]
        : [],
    [joker?.id, selectedPosition, t],
  );

  const cameraPositions = useMemo(
    () =>
      [...selectedMarkers, ...(gameMap.memberMarkers || [])]
        .map((marker) => markerToPosition(marker))
        .filter(isValidCoordinate),
    [gameMap.memberMarkers, selectedMarkers],
  );

  const handleActivate = async () => {
    await onActivate(joker, selectedPosition);
  };

  return (
    <Dialog open={open} onClose={onClose} fullScreen={fullScreen} fullWidth maxWidth="lg">
      <DialogTitle sx={{ pr: 7 }}>
        <Stack spacing={0.25}>
          <Typography variant="h6">{t('gameFakePingChooseLocation')}</Typography>
          <Typography variant="caption" color="text.secondary">
            {t('gameFakePingChooseLocationDescription')}
          </Typography>
        </Stack>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label={t('gameActionHideLocations')}
          sx={{ position: 'absolute', top: 8, right: 16 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 1, sm: 2 }, pt: { xs: 0, sm: 0 } }}>
        <Stack spacing={1.5}>
          {selectedPosition ? (
            <Alert severity="success">
              {`${t('gameFakePingSelectedLocation')}: ${formatCoordinate(
                'latitude',
                selectedPosition.latitude,
                coordinateFormat,
              )}, ${formatCoordinate('longitude', selectedPosition.longitude, coordinateFormat)}`}
            </Alert>
          ) : (
            <Alert severity="info">{t('gameFakePingTapMap')}</Alert>
          )}
          <Box
            sx={(theme) => ({
              position: 'relative',
              height: fullScreen ? 'calc(100vh - 220px)' : '70vh',
              minHeight: fullScreen ? 280 : 420,
              borderRadius: 2.5,
              overflow: 'hidden',
              border: `1px solid ${theme.palette.divider}`,
            })}
          >
            <MapView>
              <GameMapGeofences geofences={gameMap.geofences} />
              <GameMapMarkers markers={selectedMarkers} />
              <MapDefaultCamera filteredPositions={cameraPositions} />
              <MapClickSelector onSelect={setSelectedPosition} />
            </MapView>
            {loading && <Loader />}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: { xs: 1, sm: 2 }, pb: { xs: 1, sm: 2 } }}>
        <Button onClick={onClose}>{t('sharedCancel')}</Button>
        <Button
          variant="contained"
          disabled={!selectedPosition || Boolean(actionLoading)}
          onClick={handleActivate}
        >
          {t('gameActionActivateFakePing')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GameFakePingDialog;
