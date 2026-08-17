export const isValidCoordinate = (marker) =>
  Number.isFinite(marker?.latitude) && Number.isFinite(marker?.longitude);

export const markerColor = (marker) => {
  switch (marker.source) {
    case 'speedhunt':
      return 'error';
    case 'regular':
    case 'hunter_locations':
      return 'info';
    default:
      return 'success';
  }
};

export const markerToPosition = (marker, position) => ({
  ...marker,
  latitude: position?.latitude ?? marker.latitude,
  longitude: position?.longitude ?? marker.longitude,
  accuracy: position?.accuracy ?? marker.accuracy,
  course: position?.course ?? 0,
  fixTime: position?.fixTime ?? marker.fixTime,
});

const mergeByKey = (items, updates, key) => {
  const map = new Map((items || []).map((item) => [item[key], item]));
  (updates || []).forEach((item) => map.set(item[key], item));
  return Array.from(map.values());
};

const removeByKey = (items, removedIds, key) => {
  const removed = new Set(removedIds || []);
  return (items || []).filter((item) => !removed.has(item[key]));
};

export const applyGameMapUpdate = (current, update) => {
  const next = {
    ...current,
    memberMarkers: mergeByKey(current.memberMarkers, update.markers, 'memberId'),
    geofences: mergeByKey(current.geofences, update.geofences, 'id'),
  };
  next.memberMarkers = removeByKey(next.memberMarkers, update.removedMemberIds, 'memberId');
  next.geofences = removeByKey(next.geofences, update.removedGeofenceIds, 'id');
  return next;
};
