import { useId, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { map } from '../../map/core/MapView';
import { findFonts, geofenceToFeature } from '../../map/core/mapUtil';
import { useTranslation } from '../../common/components/LocalizationProvider';

const GameMapGeofences = ({ geofences }) => {
  const id = useId();
  const theme = useTheme();
  const t = useTranslation();

  useEffect(() => {
    map.addSource(id, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });
    map.addLayer({
      source: id,
      id: `${id}-fill`,
      type: 'fill',
      filter: ['all', ['==', '$type', 'Polygon']],
      metadata: { 'traccar:title': t('sharedGeofences') },
      paint: {
        'fill-color': ['get', 'color'],
        'fill-outline-color': ['get', 'color'],
        'fill-opacity': 0.1,
      },
    });
    map.addLayer({
      source: id,
      id: `${id}-line`,
      type: 'line',
      metadata: { 'traccar:title': t('sharedGeofences') },
      paint: {
        'line-color': ['get', 'color'],
        'line-width': ['get', 'width'],
        'line-opacity': ['get', 'opacity'],
      },
    });
    map.addLayer({
      source: id,
      id: `${id}-title`,
      type: 'symbol',
      metadata: { 'traccar:title': t('sharedGeofences') },
      layout: {
        'text-field': '{name}',
        'text-font': findFonts(map),
        'text-size': 12,
      },
      paint: {
        'text-halo-color': 'white',
        'text-halo-width': 1,
      },
    });

    return () => {
      [`${id}-fill`, `${id}-line`, `${id}-title`].forEach((layer) => {
        if (map.getLayer(layer)) {
          map.removeLayer(layer);
        }
      });
      if (map.getSource(id)) {
        map.removeSource(id);
      }
    };
  }, [id, t]);

  useEffect(() => {
    map.getSource(id)?.setData({
      type: 'FeatureCollection',
      features: (geofences || []).map((geofence) =>
        geofenceToFeature(theme, {
          ...geofence,
          attributes: geofence.attributes || {},
        }),
      ),
    });
  }, [geofences, id, theme]);

  return null;
};

export default GameMapGeofences;
