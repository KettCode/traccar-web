import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import BoltIcon from '@mui/icons-material/Bolt';
import CasinoIcon from '@mui/icons-material/Casino';
import MapIcon from '@mui/icons-material/Map';
import PlaceIcon from '@mui/icons-material/Place';
import { useState } from 'react';
import { formatGameJokerStatus, formatGameJokerType } from '../../common/gameFormatters';
import GameFakePingDialog from './GameFakePingDialog';
import GameJokerRevealLocations from './GameJokerRevealLocations';
import {
  getJokerActivationMessage,
  jokerStatusColor,
  terminalJokerStatuses,
} from './gameRuntimeUi';

const GameJokerDeck = ({
  gameId,
  jokers,
  summary,
  canUseJoker,
  canManageRuntime,
  actionLoading,
  revealedLocationsByJoker,
  revealLoading,
  onActivate,
  onCancel,
  onShowRevealLocations,
  onHideRevealLocations,
  t,
}) => {
  const [fakePingJoker, setFakePingJoker] = useState(null);

  if (!jokers || jokers.length === 0) {
    return (
      <Box
        sx={(theme) => ({
          p: 2,
          borderRadius: 3,
          bgcolor: theme.palette.background.default,
        })}
      >
        <Typography color="text.secondary">{t('gameNoJokersAvailable')}</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={1.25}>
      {jokers.map((joker) => {
        const activationMessage = getJokerActivationMessage(t, joker, summary);
        const revealedLocations = revealedLocationsByJoker?.[joker.id];
        const canShowRevealLocations =
          joker.type === 'request_hunter_locations' &&
          joker.status === 'used' &&
          Boolean(onShowRevealLocations);
        const canChooseFakePing = joker.type === 'fake_ping' && joker.status === 'unlocked';
        return (
          <Box
            key={joker.id}
            sx={(theme) => ({
              p: 1.5,
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette[jokerStatusColor(joker.status)]?.main || theme.palette.divider, 0.3)}`,
              bgcolor: alpha(
                theme.palette[jokerStatusColor(joker.status)]?.main ||
                  theme.palette.background.default,
                0.06,
              ),
            })}
          >
            <Stack spacing={1.25}>
              <Stack
                direction="row"
                spacing={1.25}
                alignItems="flex-start"
                justifyContent="space-between"
                sx={{ width: '100%' }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ minWidth: 0, flexGrow: 1 }}
                >
                  <Box
                    sx={(theme) => ({
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      display: 'grid',
                      placeItems: 'center',
                      color: theme.palette.primary.main,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      flexShrink: 0,
                    })}
                  >
                    <CasinoIcon fontSize="small" />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle2">
                      {formatGameJokerType(t, joker.type)}
                    </Typography>
                    {joker.memberDisplayName && (
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {joker.memberDisplayName}
                      </Typography>
                    )}
                  </Box>
                </Stack>
                <Chip
                  size="small"
                  color={jokerStatusColor(joker.status)}
                  label={formatGameJokerStatus(t, joker.status)}
                  sx={{ flexShrink: 0 }}
                />
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {canUseJoker && joker.status === 'unlocked' && !canChooseFakePing && (
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<BoltIcon />}
                    disabled={Boolean(activationMessage) || Boolean(actionLoading)}
                    onClick={() => onActivate(joker)}
                  >
                    {t('gameActionActivateJoker')}
                  </Button>
                )}
                {canUseJoker && canChooseFakePing && (
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<PlaceIcon />}
                    disabled={Boolean(actionLoading)}
                    onClick={() => setFakePingJoker(joker)}
                  >
                    {t('gameActionChooseFakePingLocation')}
                  </Button>
                )}
                {canManageRuntime && !terminalJokerStatuses.includes(joker.status) && (
                  <Button
                    size="small"
                    variant="outlined"
                    color="warning"
                    disabled={Boolean(actionLoading)}
                    onClick={() => onCancel(joker)}
                  >
                    {t('gameActionCancelJoker')}
                  </Button>
                )}
                {canShowRevealLocations && !revealedLocations && (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<MapIcon />}
                    disabled={Boolean(revealLoading)}
                    onClick={() => onShowRevealLocations(joker)}
                  >
                    {t('gameActionShowHunterLocations')}
                  </Button>
                )}
              </Stack>

              {revealedLocations && (
                <GameJokerRevealLocations
                  reveal={revealedLocations}
                  onHide={() => onHideRevealLocations(joker)}
                  t={t}
                />
              )}

              {activationMessage && joker.status === 'unlocked' && (
                <Typography variant="caption" color="text.secondary">
                  {activationMessage}
                </Typography>
              )}
            </Stack>
          </Box>
        );
      })}
      {fakePingJoker && (
        <GameFakePingDialog
          open
          gameId={gameId}
          joker={fakePingJoker}
          actionLoading={actionLoading}
          onClose={() => setFakePingJoker(null)}
          onActivate={async (joker, position) => {
            const success = await onActivate(joker, position);
            if (success !== false) {
              setFakePingJoker(null);
            }
          }}
          t={t}
        />
      )}
    </Stack>
  );
};

export default GameJokerDeck;
