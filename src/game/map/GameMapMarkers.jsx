import { useCallback, useId, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { map } from '../../map/core/MapView';
import { formatTime } from '../../common/util/formatter';
import { findFonts, toMapCoordinates } from '../../map/core/mapUtil';
import { useAttributePreference } from '../../common/util/preferences';
import {
  isValidCoordinate,
  markerColor,
  markerIcon,
  markerKey,
  markerToPosition,
} from './gameMapUtils';

const GameMapMarkers = ({ markers, onMarkerClick }) => {
  const id = useId();
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));
  const iconScale = useAttributePreference('iconScale', desktop ? 0.75 : 1);

  const positions = useSelector((state) => state.session.positions);

  const onMouseEnter = () => (map.getCanvas().style.cursor = 'pointer');
  const onMouseLeave = () => (map.getCanvas().style.cursor = '');

  const onMarkerClickCallback = useCallback(
    (event) => {
      event.preventDefault();
      const feature = event.features[0];
      if (onMarkerClick) {
        onMarkerClick(feature.properties.markerKey);
      }
    },
    [onMarkerClick],
  );

  useEffect(() => {
    map.addSource(id, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });
    map.addLayer({
      id,
      type: 'symbol',
      source: id,
      filter: ['!has', 'point_count'],
      layout: {
        'icon-image': '{icon}-{color}',
        'icon-size': iconScale,
        'icon-allow-overlap': true,
        'text-field': '{name}',
        'text-allow-overlap': true,
        'text-anchor': 'bottom',
        'text-offset': [0, -2 * iconScale],
        'text-font': findFonts(map),
        'text-size': 12,
        'symbol-sort-key': ['get', 'sortKey'],
      },
      paint: {
        'text-halo-color': 'white',
        'text-halo-width': 1,
      },
    });
    map.addLayer({
      id: `${id}-clusters`,
      type: 'symbol',
      source: id,
      filter: ['has', 'point_count'],
      layout: {
        'icon-image': 'background',
        'icon-size': iconScale,
        'text-field': '{point_count_abbreviated}',
        'text-font': findFonts(map),
        'text-size': 14,
      },
    });

    map.on('mouseenter', id, onMouseEnter);
    map.on('mouseleave', id, onMouseLeave);
    map.on('click', id, onMarkerClickCallback);

    return () => {
      map.off('mouseenter', id, onMouseEnter);
      map.off('mouseleave', id, onMouseLeave);
      map.off('click', id, onMarkerClickCallback);
      if (map.getLayer(`${id}-clusters`)) {
        map.removeLayer(`${id}-clusters`);
      }
      if (map.getLayer(id)) {
        map.removeLayer(id);
      }
      if (map.getSource(id)) {
        map.removeSource(id);
      }
    };
  }, [iconScale, id, onMarkerClickCallback]);

  useEffect(() => {
    map.getSource(id)?.setData({
      type: 'FeatureCollection',
      features: markers
        .map((marker) =>
          markerToPosition(marker, marker.deviceId ? positions[marker.deviceId] : null),
        )
        .filter(isValidCoordinate)
        .map((marker) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: toMapCoordinates(marker.longitude, marker.latitude),
          },
          properties: {
            id: marker.positionId || marker.pingId || marker.memberId || marker.revealId,
            markerKey: markerKey(marker),
            sortKey: marker.memberId || marker.revealId,
            name: marker.displayName,
            fixTime: marker.fixTime ? formatTime(marker.fixTime, 'seconds') : null,
            icon: markerIcon(marker),
            color: markerColor(marker),
          },
        })),
    });
  }, [id, markers, positions]);

  return null;
};

export default GameMapMarkers;
