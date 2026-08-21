import { useMemo } from 'react';
import {
  Alert,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import MapView from '../../../map/core/MapView';
import MapDefaultCamera from '../../../map/main/MapDefaultCamera';
import MapAccuracy from '../../../map/main/MapAccuracy';
import { formatTime } from '../../../common/util/formatter';
import GameMapMarkers from '../../map/GameMapMarkers';
import { isValidCoordinate, markerToPosition } from '../../map/gameMapUtils';

const GameJokerRevealLocations = ({ reveal, onHide, t }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const markers = useMemo(() => reveal?.markers || [], [reveal?.markers]);

  const cameraPositions = useMemo(
    () => markers.map((marker) => markerToPosition(marker)).filter(isValidCoordinate),
    [markers],
  );

  return (
    <Dialog open onClose={onHide} fullScreen={fullScreen} fullWidth maxWidth="lg">
      <DialogTitle sx={{ pr: 7 }}>
        <Stack spacing={0.25}>
          <Typography variant="h6">{t('gameHunterLocations')}</Typography>
          <Typography variant="caption" color="text.secondary">
            {`${t('gameRevealedAt')}: ${formatTime(reveal?.revealedAt, 'seconds') || '-'}`}
          </Typography>
        </Stack>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onHide}
          aria-label={t('gameActionHideLocations')}
          sx={{ position: 'absolute', top: 8, right: 16 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 1, sm: 2 }, pt: { xs: 0, sm: 0 } }}>
        {markers.length > 0 ? (
          <Box
            sx={(theme) => ({
              height: fullScreen ? 'calc(100vh - 96px)' : '70vh',
              minHeight: fullScreen ? 0 : 420,
              borderRadius: 2.5,
              overflow: 'hidden',
              border: `1px solid ${theme.palette.divider}`,
            })}
          >
            <MapView>
              <MapAccuracy positions={cameraPositions} />
              <GameMapMarkers markers={markers} />
              <MapDefaultCamera filteredPositions={cameraPositions} />
            </MapView>
          </Box>
        ) : (
          <Alert severity="info">{t('gameNoRevealedLocations')}</Alert>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GameJokerRevealLocations;
