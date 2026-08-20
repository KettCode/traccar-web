import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Card, CardContent, Container, Grid, Stack, Typography } from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import Loader from '../../common/components/Loader';
import { useTranslation } from '../../common/components/LocalizationProvider';
import PageLayout from '../../common/components/PageLayout';
import { errorsActions } from '../../store';
import {
  activateGameGeofence,
  activateJoker,
  cancelJoker,
  convertMemberToHunter,
  createCatch,
  deactivateGameGeofence,
  finishSpeedhunt,
  requestSpeedhuntPing,
  startSpeedhunt,
  unlockJoker,
} from '../api/gameRuntimeApi';
import GameLiveHeader from './components/GameLiveHeader';
import GameManagementMetricsPanel from './components/GameManagementMetricsPanel';
import GameManagementPanel from './components/GameManagementPanel';
import GameMemberActionSheet from './components/GameMemberActionSheet';
import GameMemberList from './components/GameMemberList';
import GameOwnJokerCard from './components/GameOwnJokerCard';
import GameSpeedhuntPanel from './components/GameSpeedhuntPanel';
import { getActiveHuntedMembers, getMemberJokers } from './components/gameRuntimeUi';
import GameRuntimePageMenu from './GameRuntimePageMenu';
import useGameRuntimeUser from './hooks/useGameRuntimeUser';
import useCurrentGame from './hooks/useCurrentGame';
import useGameState from './hooks/useGameState';

const NoCurrentGame = ({ t }) => (
  <Container maxWidth="sm" sx={{ py: 3 }}>
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2} alignItems="flex-start">
          <SportsEsportsIcon color="primary" fontSize="large" />
          <Typography variant="h5">{t('gameNoCurrentTitle')}</Typography>
          <Typography color="text.secondary">{t('gameNoCurrentDescription')}</Typography>
        </Stack>
      </CardContent>
    </Card>
  </Container>
);

const GamePage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const t = useTranslation();
  const gameRuntimeUser = useGameRuntimeUser();
  const stateRefreshGameId = useSelector((state) => state.gameRuntime.stateRefreshGameId);
  const stateRefreshToken = useSelector((state) => state.gameRuntime.stateRefreshToken);
  const { currentGame, loading: currentGameLoading } = useCurrentGame(gameRuntimeUser && !gameId);
  const { state, loading, reload } = useGameState(gameId, 'management');
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  const activeHuntedMembers = useMemo(
    () => getActiveHuntedMembers(state?.members),
    [state?.members],
  );

  const ownJokers = useMemo(() => {
    if (!state?.jokers) {
      return [];
    }
    if (state.currentMember.role === 'game_management') {
      return getMemberJokers(state.jokers, state.currentMember.id);
    }
    return state.jokers;
  }, [state?.currentMember?.id, state?.currentMember?.role, state?.jokers]);

  useEffect(() => {
    if (!gameId && currentGame?.id) {
      navigate(`/game/${currentGame.id}`, { replace: true });
    }
  }, [currentGame?.id, gameId, navigate]);

  useEffect(() => {
    const id = Number(gameId);
    if (id && stateRefreshToken > 0 && (stateRefreshGameId == null || stateRefreshGameId === id)) {
      reload();
    }
  }, [gameId, reload, stateRefreshGameId, stateRefreshToken]);

  const runAction = async (key, action, closeSheet = false) => {
    setActionLoading(key);
    try {
      await action();
      reload();
      if (closeSheet) {
        setSelectedMember(null);
      }
    } catch (error) {
      dispatch(errorsActions.push(error.message));
    } finally {
      setActionLoading(null);
    }
  };

  const handleStartSpeedhunt = (targetMemberId, closeSheet = false) =>
    runAction('startSpeedhunt', () => startSpeedhunt(gameId, targetMemberId), closeSheet);

  const handleRequestSpeedhuntPing = (speedhuntId) =>
    runAction('requestSpeedhuntPing', () => requestSpeedhuntPing(gameId, speedhuntId));

  const handleFinishSpeedhunt = (speedhuntId) =>
    runAction('finishSpeedhunt', () => finishSpeedhunt(gameId, speedhuntId));

  const handleUnlockJoker = (memberId, type) =>
    runAction('unlockJoker', () => unlockJoker(gameId, memberId, type));

  const handleActivateJoker = (joker) =>
    runAction('activateJoker', () => activateJoker(gameId, joker.id));

  const handleCancelJoker = (joker) =>
    runAction('cancelJoker', () => cancelJoker(gameId, joker.id));

  const handleCreateCatch = (memberId, note) =>
    runAction('createCatch', () => createCatch(gameId, memberId, note), true);

  const handleConvertToHunter = (memberId) =>
    runAction('convertMemberToHunter', () => convertMemberToHunter(gameId, memberId), true);

  const handleActivateGeofence = (gameGeofenceId) =>
    runAction(`activateGeofence-${gameGeofenceId}`, () =>
      activateGameGeofence(gameId, gameGeofenceId),
    );

  const handleDeactivateGeofence = (gameGeofenceId) =>
    runAction(`deactivateGeofence-${gameGeofenceId}`, () =>
      deactivateGameGeofence(gameId, gameGeofenceId),
    );

  let content;

  if (!gameId) {
    if (currentGameLoading || currentGame) {
      content = <Loader />;
    } else {
      content = <NoCurrentGame t={t} />;
    }
  } else if (loading && !state) {
    content = <Loader />;
  } else if (!state) {
    content = (
      <Container maxWidth="sm" sx={{ py: 3 }}>
        <Alert severity="warning">{t('gameStateUnavailable')}</Alert>
      </Container>
    );
  } else {
    const management = state.currentMember.role === 'game_management';
    const selectedMemberJokers = selectedMember
      ? getMemberJokers(state.jokers, selectedMember.id)
      : [];

    content = (
      <Container maxWidth="lg" sx={{ py: { xs: 1.5, sm: 3 }, px: { xs: 1.25, sm: 3 } }}>
        <Stack spacing={2}>
          <GameLiveHeader state={state} onNextRegularPingExpired={reload} t={t} />
          {management && <GameManagementMetricsPanel state={state} t={t} />}
          {state.currentMember.role === 'hunted' && (
            <GameOwnJokerCard
              jokers={ownJokers}
              summary={state.summary}
              canUseJoker={state.allowedActions.canUseJoker}
              actionLoading={actionLoading}
              onActivateJoker={handleActivateJoker}
              t={t}
            />
          )}
          <Grid container spacing={2} alignItems="flex-start">
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack spacing={2}>
                <GameSpeedhuntPanel
                  state={state}
                  targets={activeHuntedMembers}
                  actionLoading={actionLoading}
                  onStart={(targetMemberId) => handleStartSpeedhunt(targetMemberId)}
                  onPing={handleRequestSpeedhuntPing}
                  onFinish={handleFinishSpeedhunt}
                  t={t}
                />
                {management && (
                  <GameManagementPanel
                    state={state}
                    actionLoading={actionLoading}
                    onActivateGeofence={handleActivateGeofence}
                    onDeactivateGeofence={handleDeactivateGeofence}
                    onActivateJoker={handleActivateJoker}
                    onCancelJoker={handleCancelJoker}
                    t={t}
                  />
                )}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <GameMemberList
                state={state}
                selectedMemberId={selectedMember?.id}
                onSelectMember={setSelectedMember}
                t={t}
              />
            </Grid>
          </Grid>
        </Stack>
        <GameMemberActionSheet
          open={Boolean(selectedMember)}
          member={selectedMember}
          state={state}
          memberJokers={selectedMemberJokers}
          actionLoading={actionLoading}
          onClose={() => setSelectedMember(null)}
          onStartSpeedhunt={(targetMemberId) => handleStartSpeedhunt(targetMemberId, true)}
          onUnlockJoker={handleUnlockJoker}
          onActivateJoker={handleActivateJoker}
          onCancelJoker={handleCancelJoker}
          onCreateCatch={handleCreateCatch}
          onConvertToHunter={handleConvertToHunter}
          t={t}
        />
      </Container>
    );
  }

  return (
    <PageLayout
      menu={<GameRuntimePageMenu currentGame={currentGame || state?.game} />}
      breadcrumbs={['gameGame']}
    >
      {content}
    </PageLayout>
  );
};

export default GamePage;
