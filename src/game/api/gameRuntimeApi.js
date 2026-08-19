import fetchOrThrow from '../../common/util/fetchOrThrow';

const postGameAction = async (url, body) => {
  const response = await fetchOrThrow(url, {
    method: 'POST',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  return response.json();
};

export const getCurrentGame = async (init) => {
  const response = await fetch('/api/games/current', init);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json();
};

export const getGameState = async (gameId, include, init) => {
  const query = new URLSearchParams();
  if (include) {
    query.set('include', include);
  }
  const suffix = query.size ? `?${query.toString()}` : '';
  const response = await fetchOrThrow(`/api/games/${gameId}/state${suffix}`, init);
  return response.json();
};

export const getGameMap = async (gameId, include, init) => {
  const query = new URLSearchParams();
  if (include) {
    query.set('include', include);
  }
  const suffix = query.size ? `?${query.toString()}` : '';
  const response = await fetchOrThrow(`/api/games/${gameId}/map${suffix}`, init);
  return response.json();
};

export const startSpeedhunt = (gameId, targetMemberId) =>
  postGameAction(`/api/games/${gameId}/speedhunts`, { targetMemberId });

export const requestSpeedhuntPing = (gameId, speedhuntId) =>
  postGameAction(`/api/games/${gameId}/speedhunts/${speedhuntId}/pings`);

export const finishSpeedhunt = (gameId, speedhuntId) =>
  postGameAction(`/api/games/${gameId}/speedhunts/${speedhuntId}/finish`);

export const unlockJoker = (gameId, memberId, type) =>
  postGameAction(`/api/games/${gameId}/jokers/unlock`, { memberId, type });

export const activateJoker = (gameId, jokerId, payload) =>
  postGameAction(`/api/games/${gameId}/jokers/${jokerId}/activate`, payload || {});

export const cancelJoker = (gameId, jokerId) =>
  postGameAction(`/api/games/${gameId}/jokers/${jokerId}/cancel`);

export const createCatch = (gameId, caughtMemberId, note) =>
  postGameAction(`/api/games/${gameId}/catches`, { caughtMemberId, note });

export const convertMemberToHunter = (gameId, memberId) =>
  postGameAction(`/api/games/${gameId}/members/${memberId}/convertToHunter`);

export const activateGameGeofence = (gameId, gameGeofenceId) =>
  postGameAction(`/api/games/${gameId}/geofences/${gameGeofenceId}/activate`);

export const deactivateGameGeofence = (gameId, gameGeofenceId) =>
  postGameAction(`/api/games/${gameId}/geofences/${gameGeofenceId}/deactivate`);
