import { useReducer, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAsyncTask } from '../../../reactHelper';
import fetchOrThrow from '../../../common/util/fetchOrThrow';
import { errorsActions } from '../../../store';

export const defaultGame = {
  name: '',
  status: 'draft',
  pingIntervalSeconds: 900,
  speedhuntLimit: 0,
  speedhuntPingLimit: 3,
  allowConsecutiveSpeedhuntsSameTarget: false,
  locationReminderEnabled: true,
  maxPositionAgeSeconds: 120,
  locationReminderIntervalSeconds: 300,
  plannedEndAt: null,
  startedAt: null,
};

const defaultMember = {
  username: '',
  displayName: '',
  password: '',
  role: 'hunted',
  playerId: 0,
  canStartSpeedhunt: false,
  canRequestSpeedhuntPing: false,
};

const getMemberActionFlags = (member) => ({
  canStartSpeedhunt: member.role === 'hunter' && !!member.canStartSpeedhunt,
  canRequestSpeedhuntPing: member.role === 'hunter' && !!member.canRequestSpeedhuntPing,
});

const defaultGeofence = {
  geofenceId: 0,
  name: '',
  type: 'playfield',
  role: null,
  active: true,
};

const useSetupWizard = (gameId, navigate) => {
  const dispatch = useDispatch();

  const [reloadKey, reload] = useReducer((key) => key + 1, 0);
  const [loading, setLoading] = useState(!!gameId);
  const [state, setState] = useState(null);
  const [game, setGame] = useState(defaultGame);
  const [started, setStarted] = useState(false);
  const [memberMode, setMemberMode] = useState(null);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [member, setMember] = useState(defaultMember);
  const [geofenceDialog, setGeofenceDialog] = useState(false);
  const [editingGeofenceId, setEditingGeofenceId] = useState(null);
  const [geofence, setGeofence] = useState(defaultGeofence);

  const run = async (task) => {
    try {
      return await task();
    } catch (error) {
      dispatch(errorsActions.push(error.message));
      return null;
    }
  };

  useAsyncTask(
    async ({ signal }) => {
      void reloadKey;
      if (!gameId) {
        setState(null);
        setGame(defaultGame);
        setLoading(false);
        return;
      }
      setLoading(true);
      const response = await fetchOrThrow(`/api/setup/wizard/${gameId}`, { signal });
      const data = await response.json();
      setState(data);
      setGame({ ...defaultGame, ...data.game });
      setLoading(false);
    },
    [gameId, reloadKey],
  );

  const saveGame = () =>
    run(async () => {
      if (gameId) {
        await fetchOrThrow(`/api/setup/games/${gameId}/settings`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(game),
        });
        reload();
        return true;
      }
      const response = await fetchOrThrow('/api/setup/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(game),
      });
      const created = await response.json();
      navigate(`/game/setup/${created.id}/wizard`, { replace: true });
      return true;
    });

  const openNewMember = () => {
    setEditingMemberId(null);
    setMember(defaultMember);
    setMemberMode('new');
  };

  const openExistingMember = () => {
    setEditingMemberId(null);
    setMember(defaultMember);
    setMemberMode('existing');
  };

  const openEditMember = (memberId) => {
    const current = state.members.find((item) => item.memberId === memberId);
    setEditingMemberId(memberId);
    setMember({
      ...defaultMember,
      displayName: current.displayName || '',
      role: current.role || 'hunted',
      canStartSpeedhunt: !!current.canStartSpeedhunt,
      canRequestSpeedhuntPing: !!current.canRequestSpeedhuntPing,
    });
    setMemberMode('edit');
  };

  const closeMemberDialog = () => setMemberMode(null);

  const saveMember = () =>
    run(async () => {
      if (memberMode === 'edit') {
        await fetchOrThrow(`/api/setup/games/${gameId}/members/${editingMemberId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            displayName: member.displayName,
            role: member.role,
            ...getMemberActionFlags(member),
          }),
        });
      } else if (memberMode === 'existing') {
        await fetchOrThrow(`/api/setup/games/${gameId}/members/existingPlayers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([
            {
              playerId: member.playerId,
              displayName: member.displayName,
              role: member.role,
              ...getMemberActionFlags(member),
            },
          ]),
        });
      } else {
        await fetchOrThrow(`/api/setup/games/${gameId}/members`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([
            {
              username: member.username,
              displayName: member.displayName,
              password: member.password,
              role: member.role,
              ...getMemberActionFlags(member),
            },
          ]),
        });
      }
      setMemberMode(null);
      reload();
      return true;
    });

  const openNewGeofence = () => {
    setEditingGeofenceId(null);
    setGeofence(defaultGeofence);
    setGeofenceDialog(true);
  };

  const openDrawGeofence = () => {
    navigate(`/game/setup/geofences?returnGameId=${gameId}`);
  };

  const openEditGeofence = (gameGeofenceId) => {
    const current = state.geofences.find((item) => item.id === gameGeofenceId);
    setEditingGeofenceId(gameGeofenceId);
    setGeofence({
      geofenceId: current.geofenceId,
      name: current.name || '',
      type: current.type || 'playfield',
      role: current.role || null,
      active: !!current.active,
    });
    setGeofenceDialog(true);
  };

  const saveGeofence = () =>
    run(async () => {
      if (editingGeofenceId) {
        await fetchOrThrow(`/api/setup/games/${gameId}/geofences/${editingGeofenceId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(geofence),
        });
      } else {
        await fetchOrThrow(`/api/setup/games/${gameId}/geofences`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([geofence]),
        });
      }
      setGeofenceDialog(false);
      reload();
      return true;
    });

  const startGame = () =>
    run(async () => {
      await fetchOrThrow(`/api/games/${gameId}/activate`, { method: 'POST' });
      setStarted(true);
      reload();
      return true;
    });

  return {
    gameId,
    editable: !state || state.game?.status === 'draft',
    loading,
    state,
    game,
    setGame,
    started,
    reload,
    saveGame,
    memberMode,
    member,
    setMember,
    openNewMember,
    openExistingMember,
    openEditMember,
    closeMemberDialog,
    saveMember,
    geofenceDialog,
    geofence,
    setGeofence,
    editingGeofenceId,
    setGeofenceDialog,
    openNewGeofence,
    openDrawGeofence,
    openEditGeofence,
    saveGeofence,
    startGame,
  };
};

export default useSetupWizard;
