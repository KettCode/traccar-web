import { useId, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { map } from '../../map/core/MapView';
import { formatTime } from '../../common/util/formatter';
import { findFonts, toMapCoordinates } from '../../map/core/mapUtil';
import { useAttributePreference } from '../../common/util/preferences';
import { isValidCoordinate, markerColor, markerToPosition } from './gameMapUtils';

const GameMapMarkers = ({ markers }) => {
  const id = useId();
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));
  const iconScale = useAttributePreference('iconScale', desktop ? 0.75 : 1);

  const positions = useSelector((state) => state.session.positions);

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
        'icon-image': 'person-{color}',
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

    return () => {
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
  }, [iconScale, id]);

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
            sortKey: marker.memberId || marker.revealId,
            name: marker.displayName,
            fixTime: marker.fixTime ? formatTime(marker.fixTime, 'seconds') : null,
            color: markerColor(marker),
          },
        })),
    });
  }, [id, markers, positions]);

  return null;
};

export default GameMapMarkers;
