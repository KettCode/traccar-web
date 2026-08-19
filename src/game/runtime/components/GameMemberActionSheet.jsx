import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { formatGameJokerType } from '../../common/gameFormatters';
import GameJokerDeck from './GameJokerDeck';
import GameMemberIdentity from './GameMemberIdentity';
import { jokerTypes } from './gameRuntimeUi';

const GameMemberActionSheet = ({
  open,
  member,
  state,
  memberJokers,
  actionLoading,
  onClose,
  onStartSpeedhunt,
  onUnlockJoker,
  onActivateJoker,
  onCancelJoker,
  onCreateCatch,
  onConvertToHunter,
  t,
}) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [jokerType, setJokerType] = useState(jokerTypes[0]);
  const [catchNote, setCatchNote] = useState('');

  useEffect(() => {
    setJokerType(jokerTypes[0]);
    setCatchNote('');
  }, [member?.id]);

  if (!member) {
    return null;
  }

  const activeHunted = member.role === 'hunted' && member.status === 'active';
  const caughtHunted = member.role === 'hunted' && member.status === 'caught';
  const speedhuntStartDisabled =
    state.summary.speedhuntActive || state.summary.speedhuntsRemaining <= 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: mobile
            ? {
                m: 0,
                width: '100%',
                maxWidth: '100%',
                position: 'fixed',
                bottom: 0,
                borderRadius: '24px 24px 0 0',
              }
            : { borderRadius: 4 },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <GameMemberIdentity
          member={member}
          t={t}
          avatarSize={52}
          titleVariant="h6"
          titleFontWeight={400}
          chipSx={{ mt: 0.25 }}
        />
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {activeHunted && (
            <Stack spacing={1.25}>
              <Typography variant="subtitle2">{t('gameQuickActions')}</Typography>
              {state.allowedActions.canStartSpeedhunt && (
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  startIcon={<PlayArrowIcon />}
                  disabled={speedhuntStartDisabled || Boolean(actionLoading)}
                  onClick={() => onStartSpeedhunt(member.id)}
                >
                  {t('gameActionStartSpeedhunt')}
                </Button>
              )}
              {state.allowedActions.canManageRuntime && (
                <Button
                  fullWidth
                  size="large"
                  variant="outlined"
                  color="error"
                  startIcon={<WarningAmberIcon />}
                  disabled={Boolean(actionLoading)}
                  onClick={() => onCreateCatch(member.id, catchNote)}
                >
                  {t('gameActionCreateCatch')}
                </Button>
              )}
              {state.allowedActions.canManageRuntime && (
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  label={t('gameCatchNote')}
                  value={catchNote}
                  onChange={(event) => setCatchNote(event.target.value)}
                />
              )}
              {speedhuntStartDisabled && state.allowedActions.canStartSpeedhunt && (
                <Typography variant="caption" color="text.secondary">
                  {state.summary.speedhuntActive
                    ? t('gameSpeedhuntAlreadyActive')
                    : t('gameNoSpeedhuntsRemaining')}
                </Typography>
              )}
            </Stack>
          )}

          {caughtHunted && state.allowedActions.canManageRuntime && (
            <Stack spacing={1.25}>
              <Typography variant="subtitle2">{t('gameCaughtActions')}</Typography>
              <Button
                fullWidth
                size="large"
                variant="contained"
                startIcon={<GpsFixedIcon />}
                disabled={Boolean(actionLoading)}
                onClick={() => onConvertToHunter(member.id)}
              >
                {t('gameActionConvertToHunter')}
              </Button>
              <Button fullWidth disabled variant="outlined">
                {t('gameActionRevertCatch')}
              </Button>
              <Typography variant="caption" color="text.secondary">
                {t('gameRevertCatchNeedsHistory')}
              </Typography>
            </Stack>
          )}

          {state.allowedActions.canUnlockJoker && activeHunted && (
            <Stack spacing={1.25}>
              <Divider />
              <Typography variant="subtitle2">{t('gameUnlockJokerForPlayer')}</Typography>
              <TextField
                select
                fullWidth
                size="small"
                label={t('gameJoker')}
                value={jokerType}
                onChange={(event) => setJokerType(event.target.value)}
              >
                {jokerTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {formatGameJokerType(t, type)}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<LockOpenIcon />}
                disabled={Boolean(actionLoading)}
                onClick={() => onUnlockJoker(member.id, jokerType)}
              >
                {t('gameActionUnlockJoker')}
              </Button>
            </Stack>
          )}

          {member.role === 'hunted' && (
            <Stack spacing={1.25}>
              <Divider />
              <Stack direction="row" spacing={1} alignItems="center">
                <CasinoIcon color="primary" />
                <Typography variant="subtitle2">{t('gamePlayerJokers')}</Typography>
              </Stack>
              <GameJokerDeck
                jokers={memberJokers}
                summary={state.summary}
                canUseJoker={state.allowedActions.canUseJoker}
                canManageRuntime={state.allowedActions.canManageRuntime}
                actionLoading={actionLoading}
                onActivate={onActivateJoker}
                onCancel={onCancelJoker}
                t={t}
              />
            </Stack>
          )}

          {!activeHunted && !caughtHunted && (
            <Alert severity="info">{t('gameNoPlayerActionsAvailable')}</Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: mobile ? 2.5 : 2 }}>
        <Button onClick={onClose}>{t('sharedCancel')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default GameMemberActionSheet;
