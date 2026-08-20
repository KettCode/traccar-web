import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonIcon from '@mui/icons-material/Person';
import GameStatusChip from '../../common/GameStatusChip';
import GameMemberChips from './GameMemberChips';
import { roleAvatarColor, roleIcon } from './gameRuntimeUi';

const GameRuntimeUserSheet = ({ open, currentGame, user, socket, onClose, onLogout, t }) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));
  const member = currentGame
    ? {
        role: currentGame.memberRole,
        status: currentGame.memberStatus,
      }
    : null;
  const displayName = currentGame?.memberDisplayName || user?.name || user?.email || '-';
  const accountName = user?.name || user?.email;
  const accountDetail = user?.email && user.email !== accountName ? user.email : null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
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
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ bgcolor: roleAvatarColor(currentGame?.memberRole), width: 52, height: 52 }}>
            {roleIcon(currentGame?.memberRole)}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" noWrap>
              {displayName}
            </Typography>
            {member && <GameMemberChips member={member} t={t} sx={{ mt: 0.25 }} />}
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {currentGame && (
            <Box
              sx={(theme) => ({
                p: 1.5,
                borderRadius: 3,
                bgcolor: theme.palette.background.default,
              })}
            >
              <Typography variant="caption" color="text.secondary">
                {t('gameProfileGame')}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1" sx={{ minWidth: 0, fontWeight: 800 }} noWrap>
                  {currentGame.name}
                </Typography>
                <GameStatusChip status={currentGame.status} />
              </Stack>
            </Box>
          )}

          {accountName && (
            <Box
              sx={(theme) => ({
                p: 1.25,
                borderRadius: 3,
                bgcolor: theme.palette.background.default,
                border: `1px solid ${theme.palette.divider}`,
              })}
            >
              <Stack direction="row" spacing={1.25} alignItems="center">
                <Box
                  sx={(theme) => ({
                    width: 34,
                    height: 34,
                    borderRadius: 2,
                    display: 'grid',
                    placeItems: 'center',
                    color: theme.palette.primary.main,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    flexShrink: 0,
                  })}
                >
                  <PersonIcon fontSize="small" />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" color="text.secondary">
                    {t('gameProfileAccount')}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                    {accountName}
                  </Typography>
                  {accountDetail && (
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {accountDetail}
                    </Typography>
                  )}
                </Box>
              </Stack>
            </Box>
          )}

          {socket === false && <Alert severity="warning">{t('gameConnectionLost')}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: mobile ? 2.5 : 2 }}>
        <Button color="error" variant="outlined" startIcon={<ExitToAppIcon />} onClick={onLogout}>
          {t('loginLogout')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GameRuntimeUserSheet;
