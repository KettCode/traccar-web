import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { errorsActions } from '../../../store';
import { getGameMap } from '../../api/gameRuntimeApi';

const emptyMap = {
  memberMarkers: [],
  geofences: [],
};

const useGameMap = (gameId) => {
  const dispatch = useDispatch();

  const [gameMap, setGameMap] = useState(emptyMap);
  const [loading, setLoading] = useState(Boolean(gameId));
  const [reloadToken, setReloadToken] = useState(0);

  const reload = useCallback(() => setReloadToken((value) => value + 1), []);

  useEffect(() => {
    if (!gameId) {
      setGameMap(emptyMap);
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    setLoading(true);
    getGameMap(gameId, { signal: controller.signal })
      .then((map) => setGameMap(map || emptyMap))
      .catch((error) => {
        if (error.name !== 'AbortError') {
          dispatch(errorsActions.push(error.message));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [dispatch, gameId, reloadToken]);

  return { gameMap, setGameMap, loading, reload };
};

export default useGameMap;
