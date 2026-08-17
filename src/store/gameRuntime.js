import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'gameRuntime',
  initialState: {
    mapUpdates: [],
    mapUpdateToken: 0,
    mapRefreshGameId: null,
    mapRefreshToken: 0,
    stateRefreshGameId: null,
    stateRefreshToken: 0,
  },
  reducers: {
    updateMap(state, action) {
      state.mapUpdates = action.payload || [];
      state.mapUpdateToken += 1;
    },
    refreshMap(state, action) {
      state.mapRefreshGameId = action.payload?.gameId ?? null;
      state.mapRefreshToken += 1;
    },
    refreshState(state, action) {
      state.stateRefreshGameId = action.payload?.gameId ?? null;
      state.stateRefreshToken += 1;
    },
  },
});

export { actions as gameRuntimeActions };
export { reducer as gameRuntimeReducer };
