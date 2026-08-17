import fetchOrThrow from '../../common/util/fetchOrThrow';

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
