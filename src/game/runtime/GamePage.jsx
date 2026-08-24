import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Card, CardContent, Container, Grid, Stack, Typography } from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import Loader from '../../common/components/Loader';
import { useTranslation } from '../../common/components/LocalizationProvider';
import PageLayout from '../../common/components/PageLayout';
import { errorsActions } from '../../store';
import { formatGameJokerType } from '../common/gameFormatters';
import {
  activateGameGeofence,
  activateJoker,
  cancelJoker,
  convertMemberToHunter,
  createCatch,
  deactivateGameGeofence,
  finishSpeedhunt,
  getJokerRevealedLocations,
  requestSpeedhuntPing,
  startSpeedhunt,
  unlockJoker,
} from '../api/gameRuntimeApi';
import GameActionConfirmDialog from './components/GameActionConfirmDialog';
import GameJokerAnimationOverlay from './components/GameJokerAnimationOverlay';
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
  const [revealLoading, setRevealLoading] = useState(null);
  const [revealedLocationsByJoker, setRevealedLocationsByJoker] = useState({});
  const [selectedMember, setSelectedMember] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [jokerAnimation, setJokerAnimation] = useState(null);
  const [pendingJokerAnimation, setPendingJokerAnimation] = useState(null);
  const pendingRevealLocationsRef = useRef({});
  const revealLocationsAfterAnimationRef = useRef(null);

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

  useEffect(() => {
    if (!pendingJokerAnimation) {
      return undefined;
    }

    const targetName = state?.summary?.speedhuntTargetDisplayName;
    if (pendingJokerAnimation.type === 'reveal_speedhunt' && targetName) {
      setJokerAnimation({ ...pendingJokerAnimation, targetName });
      setPendingJokerAnimation(null);
      return undefined;
    }

    const timeout = setTimeout(() => {
      setJokerAnimation({
        ...pendingJokerAnimation,
        targetName: targetName || t('gameJokerAnimationTargetUnavailable'),
      });
      setPendingJokerAnimation(null);
    }, 8000);

    return () => clearTimeout(timeout);
  }, [pendingJokerAnimation, state?.summary?.speedhuntTargetDisplayName, t]);

  const runAction = async (key, action, closeSheet = false) => {
    setActionLoading(key);
    try {
      await action();
      reload();
      if (closeSheet) {
        setSelectedMember(null);
      }
      return true;
    } catch (error) {
      dispatch(errorsActions.push(error.message));
      return false;
    } finally {
      setActionLoading(null);
    }
  };

  const getMemberDisplayName = (memberId) =>
    state?.members?.find((member) => member.id === memberId)?.displayName || t('gameUnknownTarget');

  const getGeofenceName = (gameGeofenceId) =>
    state?.geofences?.find((geofence) => geofence.id === gameGeofenceId)?.name || gameGeofenceId;

  const getActivateJokerConfirmTitle = (joker) => {
    switch (joker.type) {
      case 'skip_ping':
        return t('gameConfirmSkipPingTitle');
      case 'reveal_speedhunt':
        return t('gameConfirmRevealSpeedhuntTitle');
      case 'request_hunter_locations':
        return t('gameConfirmRequestHunterLocationsTitle');
      default:
        return t('gameConfirmActivateJokerTitle');
    }
  };

  const getJokerConfirmDetails = (joker, memberId) => {
    const details = [{ label: t('gameJoker'), value: formatGameJokerType(t, joker.type) }];
    const memberDisplayName =
      joker.memberDisplayName || (memberId ? getMemberDisplayName(memberId) : null);
    if (memberDisplayName) {
      details.push({ label: t('gamePlayer'), value: memberDisplayName });
    }
    return details;
  };

  const showJokerAnimation = (joker) => {
    const animation = {
      key: `${joker.id}-${Date.now()}`,
      type: joker.type,
      jokerName: formatGameJokerType(t, joker.type),
      memberName: joker.memberDisplayName,
    };

    if (joker.type === 'reveal_speedhunt') {
      const targetName = state?.summary?.speedhuntTargetDisplayName;
      if (targetName) {
        setJokerAnimation({ ...animation, targetName });
      } else {
        setPendingJokerAnimation(animation);
      }
      return;
    }

    setJokerAnimation(animation);
    if (joker.type === 'request_hunter_locations') {
      revealLocationsAfterAnimationRef.current = joker;
      handleShowRevealLocations(joker, true);
    }
  };

  const runActivateJoker = async (joker, payload) => {
    const success = await runAction('activateJoker', () =>
      activateJoker(gameId, joker.id, payload),
    );
    if (success) {
      showJokerAnimation(joker);
    }
    return success;
  };

  const requestConfirm = (action) => setConfirmAction(action);

  const handleConfirmAction = async () => {
    const success = await confirmAction.action();
    if (success !== false) {
      setConfirmAction(null);
    }
  };

  const handleStartSpeedhunt = (targetMemberId, closeSheet = false) =>
    requestConfirm({
      title: t('gameConfirmStartSpeedhuntTitle'),
      details: [{ label: t('gameSpeedhuntTarget'), value: getMemberDisplayName(targetMemberId) }],
      confirmLabel: t('gameActionStartSpeedhunt'),
      confirmColor: 'error',
      action: () =>
        runAction('startSpeedhunt', () => startSpeedhunt(gameId, targetMemberId), closeSheet),
    });

  const handleRequestSpeedhuntPing = (speedhuntId) =>
    requestConfirm({
      title: t('gameConfirmRequestSpeedhuntPingTitle'),
      message: t('gameConfirmRequestSpeedhuntPingMessage'),
      confirmLabel: t('gameActionRequestSpeedhuntPing'),
      confirmColor: 'error',
      action: () =>
        runAction('requestSpeedhuntPing', () => requestSpeedhuntPing(gameId, speedhuntId)),
    });

  const handleFinishSpeedhunt = (speedhuntId) =>
    requestConfirm({
      title: t('gameConfirmFinishSpeedhuntTitle'),
      message: t('gameConfirmFinishSpeedhuntMessage'),
      confirmLabel: t('gameActionFinishSpeedhunt'),
      confirmColor: 'warning',
      action: () => runAction('finishSpeedhunt', () => finishSpeedhunt(gameId, speedhuntId)),
    });

  const handleUnlockJoker = (memberId, type) =>
    requestConfirm({
      title: t('gameConfirmUnlockJokerTitle'),
      details: [
        { label: t('gameJoker'), value: formatGameJokerType(t, type) },
        { label: t('gamePlayer'), value: getMemberDisplayName(memberId) },
      ],
      confirmLabel: t('gameActionUnlockJoker'),
      action: () => runAction('unlockJoker', () => unlockJoker(gameId, memberId, type)),
    });

  const handleActivateJoker = (joker, payload) => {
    if (joker.type === 'fake_ping' && payload) {
      return runActivateJoker(joker, payload);
    }
    return requestConfirm({
      title: getActivateJokerConfirmTitle(joker),
      details: getJokerConfirmDetails(joker),
      confirmLabel: t('gameActionActivateJoker'),
      confirmColor: joker.type === 'skip_ping' ? 'warning' : 'primary',
      action: () => runActivateJoker(joker, payload),
    });
  };

  const handleCancelJoker = (joker) =>
    requestConfirm({
      title: t('gameConfirmCancelJokerTitle'),
      details: getJokerConfirmDetails(joker),
      confirmLabel: t('gameActionCancelJoker'),
      confirmColor: 'warning',
      action: () => runAction('cancelJoker', () => cancelJoker(gameId, joker.id)),
    });

  const handleShowRevealLocations = async (joker, deferUntilAnimationEnds = false) => {
    setRevealLoading(joker.id);
    try {
      const reveal = await getJokerRevealedLocations(gameId, joker.id);
      if (deferUntilAnimationEnds) {
        if (revealLocationsAfterAnimationRef.current?.id === joker.id) {
          pendingRevealLocationsRef.current = {
            ...pendingRevealLocationsRef.current,
            [joker.id]: reveal,
          };
        } else {
          setRevealedLocationsByJoker({ [joker.id]: reveal });
        }
      } else {
        setRevealedLocationsByJoker({ [joker.id]: reveal });
      }
    } catch (error) {
      dispatch(errorsActions.push(error.message));
    } finally {
      setRevealLoading(null);
    }
  };

  const handleHideRevealLocations = (joker) => {
    setRevealedLocationsByJoker((current) => {
      const next = { ...current };
      delete next[joker.id];
      return next;
    });
  };

  const handleCloseJokerAnimation = () => {
    const revealJoker = revealLocationsAfterAnimationRef.current;
    setJokerAnimation(null);
    if (revealJoker) {
      const reveal = pendingRevealLocationsRef.current[revealJoker.id];
      revealLocationsAfterAnimationRef.current = null;
      if (reveal) {
        const nextPending = { ...pendingRevealLocationsRef.current };
        delete nextPending[revealJoker.id];
        pendingRevealLocationsRef.current = nextPending;
        setRevealedLocationsByJoker({ [revealJoker.id]: reveal });
      }
    }
  };

  const handleCreateCatch = (memberId, note) =>
    requestConfirm({
      title: t('gameConfirmCreateCatchTitle'),
      details: [{ label: t('gamePlayer'), value: getMemberDisplayName(memberId) }],
      confirmLabel: t('gameActionCreateCatch'),
      confirmColor: 'error',
      action: () => runAction('createCatch', () => createCatch(gameId, memberId, note), true),
    });

  const handleConvertToHunter = (memberId) =>
    requestConfirm({
      title: t('gameConfirmConvertToHunterTitle'),
      details: [{ label: t('gamePlayer'), value: getMemberDisplayName(memberId) }],
      confirmLabel: t('gameActionConvertToHunter'),
      confirmColor: 'error',
      action: () =>
        runAction('convertMemberToHunter', () => convertMemberToHunter(gameId, memberId), true),
    });

  const handleActivateGeofence = (gameGeofenceId) =>
    requestConfirm({
      title: t('gameConfirmActivateZoneTitle'),
      details: [{ label: t('gameZone'), value: getGeofenceName(gameGeofenceId) }],
      confirmLabel: t('gameActionActivateZone'),
      action: () =>
        runAction(`activateGeofence-${gameGeofenceId}`, () =>
          activateGameGeofence(gameId, gameGeofenceId),
        ),
    });

  const handleDeactivateGeofence = (gameGeofenceId) =>
    requestConfirm({
      title: t('gameConfirmDeactivateZoneTitle'),
      details: [{ label: t('gameZone'), value: getGeofenceName(gameGeofenceId) }],
      confirmLabel: t('gameActionDeactivateZone'),
      confirmColor: 'warning',
      action: () =>
        runAction(`deactivateGeofence-${gameGeofenceId}`, () =>
          deactivateGameGeofence(gameId, gameGeofenceId),
        ),
    });

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
              gameId={gameId}
              jokers={ownJokers}
              summary={state.summary}
              canUseJoker={state.allowedActions.canUseJoker}
              actionLoading={actionLoading}
              revealedLocationsByJoker={revealedLocationsByJoker}
              revealLoading={revealLoading}
              onActivateJoker={handleActivateJoker}
              onShowRevealLocations={handleShowRevealLocations}
              onHideRevealLocations={handleHideRevealLocations}
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
        <GameActionConfirmDialog
          action={confirmAction}
          loading={Boolean(actionLoading)}
          onCancel={() => setConfirmAction(null)}
          onConfirm={handleConfirmAction}
          t={t}
        />
        <GameJokerAnimationOverlay
          key={jokerAnimation?.key}
          animation={jokerAnimation}
          onClose={handleCloseJokerAnimation}
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
