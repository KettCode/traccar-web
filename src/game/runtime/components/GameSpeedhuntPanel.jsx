import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import FlagIcon from '@mui/icons-material/Flag';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RadarIcon from '@mui/icons-material/Radar';
import { useEffect, useState } from 'react';
import GameSectionHeader from './GameSectionHeader';

const GameSpeedhuntPanel = ({ state, targets, actionLoading, onStart, onPing, onFinish, t }) => {
  const [targetMemberId, setTargetMemberId] = useState('');
  const { summary, allowedActions } = state;
  const active = summary.speedhuntActive;
  const progress =
    summary.speedhuntPingLimit > 0
      ? Math.min(100, (summary.speedhuntPingNumber / summary.speedhuntPingLimit) * 100)
      : 0;

  useEffect(() => {
    if (targets.length === 0) {
      setTargetMemberId('');
    } else if (!targets.some((member) => String(member.id) === targetMemberId)) {
      setTargetMemberId(String(targets[0].id));
    }
  }, [targetMemberId, targets]);

  return (
    <Card
      variant="outlined"
      sx={(theme) => ({
        borderRadius: 4,
        borderColor: active ? alpha(theme.palette.error.main, 0.28) : undefined,
        bgcolor: active ? alpha(theme.palette.error.main, 0.035) : undefined,
      })}
    >
      <CardContent>
        <Stack spacing={2}>
          <GameSectionHeader
            icon={<RadarIcon />}
            title={t('gameSpeedhunt')}
            color={active ? 'error' : 'primary'}
            action={
              <Chip
                color={active ? 'error' : 'default'}
                label={active ? t('gameSpeedhuntActiveShort') : t('gameSpeedhuntInactiveShort')}
              />
            }
          />

          {active ? (
            <Stack spacing={1.5}>
              <Box
                sx={(theme) => ({
                  p: 1.5,
                  borderRadius: 3,
                  bgcolor: theme.palette.background.default,
                })}
              >
                <Typography variant="caption" color="text.secondary">
                  {t('gameSpeedhuntTarget')}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {summary.speedhuntTargetRevealed
                    ? summary.speedhuntTargetDisplayName || t('gameUnknownTarget')
                    : t('gameSpeedhuntTargetHidden')}
                </Typography>
              </Box>
              <Box>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 0.75 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {t('gameSpeedhuntPingProgress')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {summary.speedhuntPingNumber} / {summary.speedhuntPingLimit || '-'}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  color="error"
                  sx={{ height: 10, borderRadius: 99 }}
                />
              </Box>
            </Stack>
          ) : (
            <Stack spacing={1.5}>
              <Box>
                <Chip label={`${t('gameSpeedhuntsRemaining')}: ${summary.speedhuntsRemaining}`} />
              </Box>
              <Typography color="text.secondary">
                {summary.speedhuntsRemaining > 0
                  ? t('gameNoActiveSpeedhuntDescription')
                  : t('gameNoSpeedhuntsRemaining')}
              </Typography>
              {allowedActions.canStartSpeedhunt && (
                <TextField
                  select
                  fullWidth
                  size="small"
                  label={t('gameSpeedhuntTarget')}
                  value={targetMemberId}
                  disabled={targets.length === 0 || summary.speedhuntsRemaining <= 0}
                  onChange={(event) => setTargetMemberId(event.target.value)}
                >
                  {targets.map((member) => (
                    <MenuItem key={member.id} value={String(member.id)}>
                      {member.displayName}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </Stack>
          )}
        </Stack>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2, pt: 0, flexWrap: 'wrap', gap: 1 }}>
        {!active && allowedActions.canStartSpeedhunt && (
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            disabled={
              targets.length === 0 ||
              !targetMemberId ||
              summary.speedhuntsRemaining <= 0 ||
              Boolean(actionLoading)
            }
            onClick={() => onStart(Number(targetMemberId))}
          >
            {t('gameActionStartSpeedhunt')}
          </Button>
        )}
        {active && allowedActions.canRequestSpeedhuntPing && (
          <Button
            variant="contained"
            color="error"
            size="large"
            startIcon={<GpsFixedIcon />}
            disabled={!summary.speedhuntId || Boolean(actionLoading)}
            onClick={() => onPing(summary.speedhuntId)}
          >
            {t('gameActionRequestSpeedhuntPing')}
          </Button>
        )}
        {active && allowedActions.canManageRuntime && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<FlagIcon />}
            disabled={!summary.speedhuntId || Boolean(actionLoading)}
            onClick={() => onFinish(summary.speedhuntId)}
          >
            {t('gameActionFinishSpeedhunt')}
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default GameSpeedhuntPanel;
