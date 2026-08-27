import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { formatGameDurationSeconds } from '../../common/gameFormatters';
import GameStatusChip from '../../common/GameStatusChip';

const useCountdown = (value) => {
  const [seconds, setSeconds] = useState(value);

  useEffect(() => {
    setSeconds(value);
  }, [value]);

  useEffect(() => {
    if (value == null) {
      return undefined;
    }
    const interval = setInterval(() => {
      setSeconds((current) => (current == null ? current : Math.max(0, current - 1)));
    }, 1000);
    return () => clearInterval(interval);
  }, [value]);

  return seconds;
};

const HeaderMetric = ({ icon, label, value, color = 'primary' }) => (
  <Box sx={{ minWidth: 0, flex: 1 }}>
    <Stack direction="row" spacing={0.75} alignItems="center" color={`${color}.main`}>
      {icon}
      <Typography variant="caption" color="text.secondary" noWrap>
        {label}
      </Typography>
    </Stack>
    <Typography variant="h6" sx={{ mt: 0.25, fontWeight: 800, lineHeight: 1.15 }} noWrap>
      {value}
    </Typography>
  </Box>
);

const GameLiveHeader = ({ state, t }) => {
  const { game, summary } = state;
  const danger = summary.speedhuntActive;
  const remainingSeconds = useCountdown(game.remainingSeconds);
  const nextRegularPingInSeconds = useCountdown(summary.nextRegularPingInSeconds);

  return (
    <Card
      elevation={0}
      sx={(theme) => ({
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 4,
        border: `1px solid ${alpha(
          danger ? theme.palette.error.main : theme.palette.primary.main,
          0.2,
        )}`,
        bgcolor: theme.palette.background.paper,
        '&:before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at top right, ${alpha(
            danger ? theme.palette.error.main : theme.palette.primary.main,
            0.22,
          )}, transparent 44%)`,
          pointerEvents: 'none',
        },
      })}
    >
      <CardContent sx={{ position: 'relative', p: { xs: 2, sm: 2.5 } }}>
        <Stack spacing={2}>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="flex-start"
            justifyContent="space-between"
          >
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.05 }}>
                {game.name}
              </Typography>
            </Box>
            <GameStatusChip status={game.status} />
          </Stack>

          <Stack
            direction="row"
            spacing={{ xs: 1, sm: 1.5 }}
            divider={<Divider orientation="vertical" flexItem />}
            sx={{ minWidth: 0 }}
          >
            <HeaderMetric
              icon={<AccessTimeIcon fontSize="small" />}
              label={t('gameRemainingTime')}
              value={formatGameDurationSeconds(t, remainingSeconds)}
              color={danger ? 'error' : 'primary'}
            />
            <HeaderMetric
              icon={<PersonPinCircleIcon fontSize="small" />}
              label={t('gameNextRegularPing')}
              value={formatGameDurationSeconds(t, nextRegularPingInSeconds)}
              color="info"
            />
            <HeaderMetric
              icon={<VisibilityIcon fontSize="small" />}
              label={t('gameSpeedhunt')}
              value={
                summary.speedhuntActive
                  ? t('gameSpeedhuntActiveShort')
                  : t('gameSpeedhuntInactiveShort')
              }
              color={danger ? 'error' : 'success'}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default GameLiveHeader;
