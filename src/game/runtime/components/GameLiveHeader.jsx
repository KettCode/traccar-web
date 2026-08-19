import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import RadarIcon from '@mui/icons-material/Radar';
import { formatGameDurationSeconds } from '../../common/gameFormatters';
import GameStatusChip from '../../common/GameStatusChip';
import GameMetricBox from './GameMetricBox';

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

          <Grid container spacing={1.25}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <GameMetricBox
                icon={<AccessTimeIcon fontSize="small" />}
                label={t('gameRemainingTime')}
                value={formatGameDurationSeconds(t, remainingSeconds)}
                color={danger ? 'error' : 'primary'}
                p={1.25}
                borderRadius={2.5}
                height="100%"
                valueVariant="h6"
                valueMt={0.5}
                valueFontWeight={800}
                backgroundAlpha={0.1}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4 }}>
              <GameMetricBox
                icon={<PersonPinCircleIcon fontSize="small" />}
                label={t('gameNextRegularPing')}
                value={formatGameDurationSeconds(t, nextRegularPingInSeconds)}
                color="info"
                p={1.25}
                borderRadius={2.5}
                height="100%"
                valueVariant="h6"
                valueMt={0.5}
                valueFontWeight={800}
                backgroundAlpha={0.1}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4 }}>
              <GameMetricBox
                icon={<RadarIcon fontSize="small" />}
                label={t('gameSpeedhunt')}
                value={summary.speedhuntActive ? t('gameSpeedhuntActiveShort') : '-'}
                color={danger ? 'error' : 'success'}
                p={1.25}
                borderRadius={2.5}
                height="100%"
                valueVariant="h6"
                valueMt={0.5}
                valueFontWeight={800}
                backgroundAlpha={0.1}
              />
            </Grid>
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default GameLiveHeader;
