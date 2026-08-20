import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Paper } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import MapView from '../../map/core/MapView';
import MapCurrentLocation from '../../map/MapCurrentLocation';
import MapPadding from '../../map/MapPadding';
import MapOverlay from '../../map/overlay/MapOverlay';
import MapGeocoder from '../../map/control/MapGeocoder';
import MapScale from '../../map/MapScale';
import MapRuler from '../../map/control/MapRuler';
import MapDefaultCamera from '../../map/main/MapDefaultCamera';
import MapAccuracy from '../../map/main/MapAccuracy';
import Loader from '../../common/components/Loader';
import { useTranslation } from '../../common/components/LocalizationProvider';
import useCurrentGame from '../runtime/hooks/useCurrentGame';
import useGameMap from '../runtime/hooks/useGameMap';
import GameMapGeofences from './GameMapGeofences';
import GameMapMarkerCard from './GameMapMarkerCard';
import GameMapMarkers from './GameMapMarkers';
import { applyGameMapUpdate, isValidCoordinate, markerKey, markerToPosition } from './gameMapUtils';

const useStyles = makeStyles()((theme) => ({
  message: {
    position: 'absolute',
    top: theme.spacing(2),
    left: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 2,
    [theme.breakpoints.up('md')]: {
      left: `calc(${theme.dimensions.drawerWidthDesktop} + ${theme.spacing(4)})`,
      right: theme.spacing(2),
    },
  },
}));

const noop = () => {};

const GameMap = () => {
  const { classes } = useStyles();
  const theme = useTheme();
  const t = useTranslation();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));

  const mapUpdates = useSelector((state) => state.gameRuntime.mapUpdates);
  const mapUpdateToken = useSelector((state) => state.gameRuntime.mapUpdateToken);
  const mapRefreshGameId = useSelector((state) => state.gameRuntime.mapRefreshGameId);
  const mapRefreshToken = useSelector((state) => state.gameRuntime.mapRefreshToken);
  const positions = useSelector((state) => state.session.positions);
  const [selectedMarkerKey, setSelectedMarkerKey] = useState(null);

  const { currentGame, loading: currentGameLoading } = useCurrentGame();
  const {
    gameMap,
    setGameMap,
    loading: gameMapLoading,
    reload,
  } = useGameMap(currentGame?.id, null);

  useEffect(() => {
    if (!currentGame?.id || mapUpdateToken === 0) {
      return;
    }
    mapUpdates
      .filter((update) => update.gameId === currentGame.id)
      .forEach((update) => setGameMap((current) => applyGameMapUpdate(current, update)));
  }, [currentGame?.id, mapUpdateToken, mapUpdates, setGameMap]);

  useEffect(() => {
    if (!currentGame?.id || mapRefreshToken === 0) {
      return;
    }
    if (mapRefreshGameId == null || mapRefreshGameId === currentGame.id) {
      reload();
    }
  }, [currentGame?.id, mapRefreshGameId, mapRefreshToken, reload]);

  const markers = useMemo(
    () => [...(gameMap.memberMarkers || []), ...(gameMap.revealedMarkers || [])],
    [gameMap.memberMarkers, gameMap.revealedMarkers],
  );

  const cameraPositions = useMemo(
    () => markers.map((marker) => markerToPosition(marker)).filter(isValidCoordinate),
    [markers],
  );

  const selectedMarker = useMemo(
    () =>
      markers
        .map((marker) =>
          markerToPosition(marker, marker.deviceId ? positions[marker.deviceId] : null),
        )
        .find((marker) => markerKey(marker) === selectedMarkerKey),
    [markers, positions, selectedMarkerKey],
  );

  useEffect(() => {
    if (selectedMarkerKey && !selectedMarker) {
      setSelectedMarkerKey(null);
    }
  }, [selectedMarker, selectedMarkerKey]);

  return (
    <>
      <MapView>
        <MapOverlay />
        <GameMapGeofences geofences={gameMap.geofences} />
        <MapAccuracy positions={cameraPositions} />
        <GameMapMarkers markers={markers} onMarkerClick={setSelectedMarkerKey} />
        <MapDefaultCamera filteredPositions={cameraPositions} />
        <MapRuler positions={cameraPositions} onActiveChange={noop} />
      </MapView>
      <MapScale />
      {selectedMarker && (
        <GameMapMarkerCard
          marker={selectedMarker}
          onClose={() => setSelectedMarkerKey(null)}
          t={t}
        />
      )}
      <MapCurrentLocation />
      <MapGeocoder />
      {desktop && (
        <MapPadding
          start={
            parseInt(theme.dimensions.drawerWidthDesktop, 10) + parseInt(theme.spacing(1.5), 10)
          }
        />
      )}
      {(currentGameLoading || gameMapLoading) && <Loader />}
      {!currentGameLoading && !currentGame && (
        <Paper className={classes.message} elevation={3}>
          <Alert severity="info">{t('gameNoCurrentDescription')}</Alert>
        </Paper>
      )}
    </>
  );
};

export default GameMap;
