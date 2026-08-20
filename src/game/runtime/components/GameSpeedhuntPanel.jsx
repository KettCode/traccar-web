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
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useEffect, useState } from 'react';
import GameSectionHeader from './GameSectionHeader';

const SpeedhuntProgressDots = ({ current, limit }) => (
  <Stack direction="row" spacing={0.75} alignItems="center">
    {Array.from({ length: limit }).map((_, index) => {
      const completed = index < current;
      return (
        <Box
          key={index}
          sx={(theme) => ({
            width: 18,
            height: 18,
            borderRadius: '50%',
            border: `2px solid ${completed ? theme.palette.error.main : theme.palette.divider}`,
            bgcolor: completed
              ? alpha(theme.palette.error.main, 0.18)
              : theme.palette.background.paper,
          })}
        />
      );
    })}
  </Stack>
);

const GameSpeedhuntPanel = ({ state, targets, actionLoading, onStart, onPing, onFinish, t }) => {
  const [targetMemberId, setTargetMemberId] = useState('');
  const { summary, allowedActions } = state;
  const active = summary.speedhuntActive;
  const showStart = !active && allowedActions.canStartSpeedhunt;
  const showPing = active && allowedActions.canRequestSpeedhuntPing;
  const showFinish = active && allowedActions.canManageRuntime;
  const hasActions = showStart || showPing || showFinish;
  const fullWidthPing = showPing && !showFinish;
  const progressLimit = summary.speedhuntPingLimit || 0;
  const progress =
    progressLimit > 0 ? Math.min(100, (summary.speedhuntPingNumber / progressLimit) * 100) : 0;
  const showProgressDots = progressLimit > 0 && progressLimit <= 6;

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
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 4,
        borderColor: active ? alpha(theme.palette.error.main, 0.32) : undefined,
        bgcolor: active ? alpha(theme.palette.error.main, 0.035) : theme.palette.background.paper,
        background: active
          ? `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.11)}, ${alpha(
              theme.palette.error.main,
              0.025,
            )} 58%, ${theme.palette.background.paper})`
          : undefined,
      })}
    >
      <CardContent sx={{ pb: hasActions ? 1 : 2 }}>
        <Stack spacing={2}>
          <GameSectionHeader
            icon={<VisibilityIcon />}
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
                  bgcolor: alpha(theme.palette.background.paper, 0.78),
                  border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
                })}
              >
                <Typography variant="caption" color="text.secondary">
                  {t('gameSpeedhuntTarget')}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
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
                    {summary.speedhuntPingNumber} / {progressLimit || '-'}
                  </Typography>
                </Stack>
                {showProgressDots ? (
                  <SpeedhuntProgressDots
                    current={summary.speedhuntPingNumber}
                    limit={progressLimit}
                  />
                ) : (
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    color="error"
                    sx={{ height: 10, borderRadius: 99 }}
                  />
                )}
              </Box>
            </Stack>
          ) : (
            <Stack spacing={1.5}>
              <Box sx={{ lineHeight: 0 }}>
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
      {hasActions && (
        <CardActions sx={{ px: 2, pb: 2, pt: 0, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {showStart && (
            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              sx={{ flex: '1 1 100%' }}
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
          {showPing && (
            <Button
              variant="contained"
              color="error"
              size="large"
              startIcon={<GpsFixedIcon />}
              sx={{ flex: fullWidthPing ? '1 1 100%' : '1 1 auto' }}
              disabled={!summary.speedhuntId || Boolean(actionLoading)}
              onClick={() => onPing(summary.speedhuntId)}
            >
              {t('gameActionRequestSpeedhuntPing')}
            </Button>
          )}
          {showFinish && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<FlagIcon />}
              sx={{ flex: { xs: '1 1 auto', sm: '0 0 auto' } }}
              disabled={!summary.speedhuntId || Boolean(actionLoading)}
              onClick={() => onFinish(summary.speedhuntId)}
            >
              {t('gameActionFinishSpeedhunt')}
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
};

export default GameSpeedhuntPanel;
