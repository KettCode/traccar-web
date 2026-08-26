export const isValidCoordinate = (marker) =>
  Number.isFinite(marker?.latitude) && Number.isFinite(marker?.longitude);

export const markerKey = (marker) =>
  `${marker.source || 'marker'}:${marker.memberId || marker.revealId || marker.pingId || marker.positionId}`;

export const markerColor = (marker) => {
  switch (marker.source) {
    case 'speedhunt':
      return 'error';
    case 'fake_ping':
      return 'warning';
    case 'known_regular_ping':
      return 'neutral';
    case 'regular':
    case 'hunter_locations':
      return 'info';
    default:
      return 'success';
  }
};

export const markerIcon = (marker) => {
  if (marker.source === 'fake_ping') {
    return 'fakePing';
  }
  if (marker.source === 'known_regular_ping') {
    return 'knownPing';
  }
  switch (marker.role) {
    case 'hunter':
      return 'hunter';
    case 'hunted':
      return 'hunted';
    case 'game_management':
      return 'gameManagement';
    default:
      return 'person';
  }
};

export const markerDisplayName = (t, marker) => {
  if (marker.source === 'known_regular_ping') {
    return t('gameKnownRegularPingMarker');
  }
  return marker.displayName;
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
    knowledgeMarkers: mergeByKey(current.knowledgeMarkers, update.knowledgeMarkers, 'memberId'),
    geofences: mergeByKey(current.geofences, update.geofences, 'id'),
  };
  next.memberMarkers = removeByKey(next.memberMarkers, update.removedMemberIds, 'memberId');
  next.geofences = removeByKey(next.geofences, update.removedGeofenceIds, 'id');
  return next;
};
