import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
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
import Loader from '../../common/components/Loader';
import { useTranslation } from '../../common/components/LocalizationProvider';
import GameReadonlyBanner from '../common/GameReadonlyBanner';
import GameStatusChip from '../common/GameStatusChip';
import { formatGameMemberStatus, formatGameRole } from '../common/gameFormatters';
import useGameState from './hooks/useGameState';

const actionLabels = [
  ['canStartSpeedhunt', 'gameActionStartSpeedhunt'],
  ['canRequestSpeedhuntPing', 'gameActionRequestSpeedhuntPing'],
  ['canUseJoker', 'gameActionUseJoker'],
  ['canManageRuntime', 'gameActionManageRuntime'],
];

const GamePage = () => {
  const { gameId } = useParams();
  const t = useTranslation();

  const { state, loading } = useGameState(gameId, 'members');

  const allowedActions = useMemo(
    () => actionLabels.filter(([key]) => state?.allowedActions?.[key]),
    [state?.allowedActions],
  );

  if (loading) {
    return <Loader />;
  }

  if (!state) {
    return (
      <Container maxWidth="sm" sx={{ py: 3 }}>
        <Alert severity="warning">{t('gameStateUnavailable')}</Alert>
      </Container>
    );
  }

  const readonly = state.game.status !== 'running';

  return (
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
};

export default GamePage;
