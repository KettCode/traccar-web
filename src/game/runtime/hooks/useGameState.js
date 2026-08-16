import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { errorsActions } from '../../../store';
import { getGameState } from '../../api/gameRuntimeApi';

const useGameState = (gameId, include) => {
  const dispatch = useDispatch();

  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(Boolean(gameId));

  useEffect(() => {
    if (!gameId) {
      setState(null);
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    setLoading(true);
    getGameState(gameId, include, { signal: controller.signal })
      .then((gameState) => setState(gameState))
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
  }, [dispatch, gameId, include]);

  return { state, loading };
};

export default useGameState;
