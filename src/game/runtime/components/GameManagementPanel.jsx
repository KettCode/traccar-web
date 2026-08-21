import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CasinoIcon from '@mui/icons-material/Casino';
import MapIcon from '@mui/icons-material/Map';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { formatGameRole } from '../../common/gameFormatters';
import GameJokerDeck from './GameJokerDeck';

const formatGeofenceType = (type) => (type || '-').replaceAll('_', ' ');

const ManagementEmptyState = ({ children }) => (
  <Box
    sx={(theme) => ({
      p: 1.5,
      borderRadius: 2.5,
      bgcolor: theme.palette.background.default,
    })}
  >
    <Typography color="text.secondary">{children}</Typography>
  </Box>
);

const ManagementItem = ({ title, subtitle, statusLabel, statusColor = 'default', children }) => (
  <Box
    sx={(theme) => ({
      p: 1.25,
      borderRadius: 2.5,
      bgcolor: alpha(theme.palette.background.default, 0.72),
      border: `1px solid ${theme.palette.divider}`,
    })}
  >
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} alignItems="flex-start" justifyContent="space-between">
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Typography variant="subtitle2" noWrap>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {statusLabel && (
          <Chip
            size="small"
            color={statusColor}
            label={statusLabel}
            sx={{ ml: 'auto', flexShrink: 0 }}
          />
        )}
      </Stack>
      {children}
    </Stack>
  </Box>
);

const ManagementAccordion = ({ icon, title, count, children }) => (
  <Accordion
    disableGutters
    elevation={0}
    sx={(theme) => ({
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: '16px !important',
      '&:before': { display: 'none' },
    })}
  >
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%', pr: 1 }}>
        {icon}
        <Typography variant="subtitle1" sx={{ flexGrow: 1, fontWeight: 800 }}>
          {title}
        </Typography>
        <Chip size="small" label={count} />
      </Stack>
    </AccordionSummary>
    <AccordionDetails sx={{ pt: 0 }}>{children}</AccordionDetails>
  </Accordion>
);

const GameZonesList = ({ state, actionLoading, onActivateGeofence, onDeactivateGeofence, t }) => {
  const geofences = state.geofences || [];
  const canManage = !!state.allowedActions.canManageGeofences;

  if (geofences.length === 0) {
    return <ManagementEmptyState>{t('gameSetupNoGeofences')}</ManagementEmptyState>;
  }

  return (
    <Stack spacing={1}>
      {geofences.map((geofence) => (
        <ManagementItem
          key={geofence.id}
          title={geofence.name || geofence.id}
          subtitle={`${formatGeofenceType(geofence.type)} - ${
            geofence.role ? formatGameRole(t, geofence.role) : t('sharedAll')
          }`}
          statusLabel={geofence.active ? t('sharedActive') : t('sharedDisabled')}
          statusColor={geofence.active ? 'success' : 'default'}
        >
          <Button
            variant="outlined"
            color={geofence.active ? 'warning' : 'primary'}
            size="small"
            disabled={!canManage || Boolean(actionLoading)}
            onClick={() =>
              geofence.active ? onDeactivateGeofence(geofence.id) : onActivateGeofence(geofence.id)
            }
          >
            {geofence.active ? t('gameActionDeactivateZone') : t('gameActionActivateZone')}
          </Button>
        </ManagementItem>
      ))}
    </Stack>
  );
};

const GameManagementPanel = ({
  state,
  actionLoading,
  onActivateGeofence,
  onDeactivateGeofence,
  onActivateJoker,
  onCancelJoker,
  t,
}) => {
  const jokers = state.jokers || [];
  const speedhuntHistory = state.speedhuntHistory || [];
  const geofences = state.geofences || [];

  return (
    <Stack spacing={1.25} sx={{ width: '100%', maxWidth: 560 }}>
      <ManagementAccordion
        icon={<MapIcon color="primary" />}
        title={t('gameZones')}
        count={geofences.length}
      >
        <GameZonesList
          state={state}
          actionLoading={actionLoading}
          onActivateGeofence={onActivateGeofence}
          onDeactivateGeofence={onDeactivateGeofence}
          t={t}
        />
      </ManagementAccordion>

      <ManagementAccordion
        icon={<CasinoIcon color="primary" />}
        title={t('gameJokerOverview')}
        count={jokers.length}
      >
        <GameJokerDeck
          gameId={state.game.id}
          jokers={jokers}
          summary={state.summary}
          canUseJoker={state.allowedActions.canUseJoker}
          canManageRuntime={state.allowedActions.canManageRuntime}
          actionLoading={actionLoading}
          onActivate={onActivateJoker}
          onCancel={onCancelJoker}
          t={t}
        />
      </ManagementAccordion>

      <ManagementAccordion
        icon={<VisibilityIcon color="primary" />}
        title={t('gameSpeedhuntOverview')}
        count={speedhuntHistory.length}
      >
        {speedhuntHistory.length > 0 ? (
          <Stack spacing={1}>
            {speedhuntHistory.map((speedhunt) => (
              <ManagementItem
                key={speedhunt.id}
                title={`${t('gameSpeedhunt')} #${speedhunt.sequenceNumber}`}
                subtitle={
                  speedhunt.targetRevealed
                    ? speedhunt.targetDisplayName || t('gameUnknownTarget')
                    : t('gameSpeedhuntTargetHidden')
                }
                statusLabel={
                  speedhunt.active ? t('gameSpeedhuntActive') : t('gameSpeedhuntFinished')
                }
                statusColor={speedhunt.active ? 'error' : 'default'}
              >
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography variant="caption" color="text.secondary">
                    {t('gameSpeedhuntPingProgress')}:
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {speedhunt.pingNumber} / {speedhunt.maxPings}
                  </Typography>
                </Stack>
              </ManagementItem>
            ))}
          </Stack>
        ) : (
          <ManagementEmptyState>{t('gameNoSpeedhuntHistory')}</ManagementEmptyState>
        )}
      </ManagementAccordion>
    </Stack>
  );
};

export default GameManagementPanel;
