import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Alert,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import Loader from '../../common/components/Loader';
import { useTranslation } from '../../common/components/LocalizationProvider';
import PageLayout from '../../common/components/PageLayout';
import GameReadonlyBanner from '../common/GameReadonlyBanner';
import GameStatusChip from '../common/GameStatusChip';
import { formatGameMemberStatus, formatGameRole } from '../common/gameFormatters';
import GameRuntimePageMenu from './GameRuntimePageMenu';
import useGameRuntimeUser from './hooks/useGameRuntimeUser';
import useCurrentGame from './hooks/useCurrentGame';
import useGameState from './hooks/useGameState';

const actionLabels = [
  ['canStartSpeedhunt', 'gameActionStartSpeedhunt'],
  ['canRequestSpeedhuntPing', 'gameActionRequestSpeedhuntPing'],
  ['canUseJoker', 'gameActionUseJoker'],
  ['canManageRuntime', 'gameActionManageRuntime'],
];

const GamePage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const t = useTranslation();
  const gameRuntimeUser = useGameRuntimeUser();
  const stateRefreshGameId = useSelector((state) => state.gameRuntime.stateRefreshGameId);
  const stateRefreshToken = useSelector((state) => state.gameRuntime.stateRefreshToken);
  const { currentGame, loading: currentGameLoading } = useCurrentGame(gameRuntimeUser && !gameId);

  const { state, loading, reload } = useGameState(gameId, 'members');

  const allowedActions = useMemo(
    () => actionLabels.filter(([key]) => state?.allowedActions?.[key]),
    [state?.allowedActions],
  );

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

  let content;

  if (!gameId) {
    if (currentGameLoading || currentGame) {
      content = <Loader />;
    } else {
      content = (
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
    }
  } else if (loading) {
    content = <Loader />;
  } else if (!state) {
    content = (
      <Container maxWidth="sm" sx={{ py: 3 }}>
        <Alert severity="warning">{t('gameStateUnavailable')}</Alert>
      </Container>
    );
  } else {
    const readonly = state.game.status !== 'running';

    content = (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Typography variant="h4">{state.game.name}</Typography>
            <GameStatusChip status={state.game.status} />
          </Stack>
          <GameReadonlyBanner readonly={readonly} />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="h6">{t('gameCurrentMember')}</Typography>
                    <Typography>{state.currentMember.displayName}</Typography>
                    <Typography color="text.secondary">
                      {`${formatGameRole(t, state.currentMember.role)} - ${formatGameMemberStatus(
                        t,
                        state.currentMember.status,
                      )}`}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="h6">{t('gameAllowedActions')}</Typography>
                    {allowedActions.length > 0 ? (
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {allowedActions.map(([key, label]) => (
                          <Chip key={key} label={t(label)} color="primary" size="small" />
                        ))}
                      </Stack>
                    ) : (
                      <Typography color="text.secondary">{t('gameNoAllowedActions')}</Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card variant="outlined">
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="h6">{t('gameSummary')}</Typography>
                <Typography color="text.secondary">
                  {t('gameSpeedhuntsRemaining')}: {state.summary.speedhuntsRemaining}
                </Typography>
                <Typography color="text.secondary">
                  {t('gameSpeedhuntActive')}:{' '}
                  {state.summary.speedhuntActive ? t('sharedYes') : t('sharedNo')}
                </Typography>
                {state.summary.nextRegularPingInSeconds != null && (
                  <Typography color="text.secondary">
                    {t('gameNextRegularPingInSeconds')}: {state.summary.nextRegularPingInSeconds}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">{t('gameMembers')}</Typography>
              <List disablePadding>
                {(state.members || []).map((member, index) => (
                  <div key={member.id}>
                    {index > 0 && <Divider component="li" />}
                    <ListItem disableGutters>
                      <ListItemText
                        primary={member.displayName}
                        secondary={`${formatGameRole(t, member.role)} - ${formatGameMemberStatus(t, member.status)}`}
                      />
                    </ListItem>
                  </div>
                ))}
              </List>
            </CardContent>
          </Card>
        </Stack>
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
