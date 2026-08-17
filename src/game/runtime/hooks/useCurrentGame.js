import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { errorsActions } from '../../../store';
import { getCurrentGame } from '../../api/gameRuntimeApi';

const useCurrentGame = (enabled = true) => {
  const dispatch = useDispatch();

  const [currentGame, setCurrentGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled) {
      setCurrentGame(null);
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    setLoading(true);
    getCurrentGame({ signal: controller.signal })
      .then((game) => setCurrentGame(game))
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
  }, [dispatch, enabled]);

  return { currentGame, loading };
};

export default useCurrentGame;
