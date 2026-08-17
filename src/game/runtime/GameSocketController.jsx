import { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { errorsActions, gameRuntimeActions } from '../../store';
import useGameRuntimeUser from './hooks/useGameRuntimeUser';

const logoutCode = 4000;

const supportedMapUpdateTypes = new Set(['gamePositionUpdated', 'gameGeofenceUpdated']);

const GameSocketController = () => {
  const dispatch = useDispatch();
  const enabled = useGameRuntimeUser();

  const socketRef = useRef();
  const reconnectTimeoutRef = useRef();

  const clearReconnectTimeout = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const connectSocketRef = useRef();

  const refreshRuntime = useCallback(
    (gameId = null) => {
      dispatch(gameRuntimeActions.refreshMap({ gameId }));
      dispatch(gameRuntimeActions.refreshState({ gameId }));
    },
    [dispatch],
  );

  const connectSocket = useCallback(() => {
    clearReconnectTimeout();
    if (socketRef.current && socketRef.current.readyState !== WebSocket.CLOSED) {
      socketRef.current.close();
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}/api/game/socket`);
    socketRef.current = socket;

    socket.onopen = () => {
      refreshRuntime();
    };

    socket.onclose = (event) => {
      if (event.code === logoutCode) return;
      if (socketRef.current !== socket) return;
      clearReconnectTimeout();
      reconnectTimeoutRef.current = setTimeout(() => {
        reconnectTimeoutRef.current = null;
        connectSocketRef.current?.();
      }, 60000);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.gameMapUpdates) {
        const supportedUpdates = [];
        data.gameMapUpdates.forEach((update) => {
          if (update.stateRefresh || !supportedMapUpdateTypes.has(update.type)) {
            refreshRuntime(update.gameId);
          } else {
            supportedUpdates.push(update);
          }
        });
        if (supportedUpdates.length) {
          dispatch(gameRuntimeActions.updateMap(supportedUpdates));
        }
      }
      data.gameNotifications
        ?.filter((notification) => notification.stateRefresh)
        .forEach((notification) => refreshRuntime(notification.gameId));
    };
  }, [clearReconnectTimeout, dispatch, refreshRuntime]);

  connectSocketRef.current = connectSocket;

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    try {
      connectSocket();
    } catch (error) {
      dispatch(errorsActions.push(error.message));
    }

    return () => {
      clearReconnectTimeout();
      socketRef.current?.close(logoutCode);
    };
  }, [clearReconnectTimeout, connectSocket, dispatch, enabled]);

  useEffect(() => {
    if (!enabled) return undefined;
    const onVisibility = () => {
      if (!document.hidden) {
        refreshRuntime();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [enabled, refreshRuntime]);

  return null;
};

export default GameSocketController;
