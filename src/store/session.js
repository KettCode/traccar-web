import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'session',
  initialState: {
    server: null,
    user: null,
    socket: null,
    includeLogs: false,
    logs: [],
    positions: {},
    manhuntPositions: {},
    history: {},
  },
  reducers: {
    updateServer(state, action) {
      state.server = action.payload;
    },
    updateUser(state, action) {
      state.user = action.payload;
    },
    updateSocket(state, action) {
      state.socket = action.payload;
    },
    enableLogs(state, action) {
      state.includeLogs = action.payload;
      if (!action.payload) {
        state.logs = [];
      }
    },
    updateLogs(state, action) {
      state.logs.push(...action.payload);
    },
    updatePositions(state, action) {
      const liveRoutes = state.user.attributes.mapLiveRoutes || state.server.attributes.mapLiveRoutes || 'none';
      const liveRoutesLimit = state.user.attributes['web.liveRouteLength'] || state.server.attributes['web.liveRouteLength'] || 10;
      action.payload.forEach((position) => {
        if (position.isManhunt && state.user.manhuntRole == 2) {
          state.manhuntPositions = state.manhuntPositions || {};
          state.manhuntPositions[position.deviceId] = position;
        }

        state.positions[position.deviceId] = position;
        if (liveRoutes !== 'none') {
          const route = state.history[position.deviceId] || [];
          const last = route.at(-1);
          if (!last || (last[0] !== position.longitude && last[1] !== position.latitude)) {
            state.history[position.deviceId] = [...route.slice(1 - liveRoutesLimit), [position.longitude, position.latitude]];
          }
        } else {
          state.history = {};
        }
      });
    },
    clearPositions(state, action) {
      state.positions = [];
    },
  },
});

export { actions as sessionActions };
export { reducer as sessionReducer };

export const selectPositionsWithManhunt = (state) => {
  const { positions = {}, manhuntPositions = {}, user } = state.session;
  const devices = state.devices.items;

  const realPositions = Object.values(positions);
  if(user.manhuntRole != 2)
    return realPositions;

  const userDevice = Object.values(devices).find(d => d.manhuntUserId === user.id);
  if(!userDevice)
    return realPositions;

  const hunterPositions = Object.values(manhuntPositions)
    .filter((p) => !realPositions.some(rp => rp.id === p.id) && p.deviceId == userDevice.id)
    .map((p) => ({
      ...p,
      disabled: true,
    }));

  return [...realPositions, ...hunterPositions];
};
