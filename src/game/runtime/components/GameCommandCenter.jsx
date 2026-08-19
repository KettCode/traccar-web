import { Box, Button, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import MapIcon from '@mui/icons-material/Map';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { formatGameRole } from '../../common/gameFormatters';
import GameMetricBox from './GameMetricBox';
import GameSectionHeader from './GameSectionHeader';
import { getActiveHuntedMembers, getCaughtHuntedMembers } from './gameRuntimeUi';

const formatGeofenceType = (type) => (type || '-').replaceAll('_', ' ');

const GameZonesPreviewCard = ({ state, actionLoading, onActivate, onDeactivate, t }) => {
  const geofences = state.geofences || [];
  const canManage = !!state.allowedActions.canManageGeofences;

  return (
    <Box
      sx={(theme) => ({
        p: 1.5,
        borderRadius: 3,
        bgcolor: theme.palette.background.default,
        border: `1px dashed ${theme.palette.divider}`,
      })}
    >
      <Stack spacing={1.25}>
        <Stack direction="row" spacing={1} alignItems="center">
          <MapIcon color="primary" />
          <Box>
            <Typography variant="subtitle2">{t('gameZones')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('gameZonesDescription')}
            </Typography>
          </Box>
        </Stack>
        {geofences.length > 0 ? (
          <Stack spacing={1}>
            {geofences.map((geofence) => (
              <Box
                key={geofence.id}
                sx={(theme) => ({
                  p: 1.25,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.background.paper, 0.72),
                  border: `1px solid ${theme.palette.divider}`,
                })}
              >
                <Stack spacing={1}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="flex-start"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography variant="subtitle2">{geofence.name || geofence.id}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatGeofenceType(geofence.type)} -{' '}
                        {geofence.role ? formatGameRole(t, geofence.role) : t('sharedAll')}
                      </Typography>
                    </Box>
                    <Chip
                      size="small"
                      color={geofence.active ? 'success' : 'default'}
                      label={geofence.active ? t('sharedActive') : t('sharedDisabled')}
                    />
                  </Stack>
                  <Button
                    variant="outlined"
                    color={geofence.active ? 'warning' : 'primary'}
                    size="small"
                    disabled={!canManage || Boolean(actionLoading)}
                    onClick={() =>
                      geofence.active ? onDeactivate(geofence.id) : onActivate(geofence.id)
                    }
                  >
                    {geofence.active
                      ? t('gameActionDeactivateZones')
                      : t('gameActionActivateZones')}
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography color="text.secondary">{t('gameSetupNoGeofences')}</Typography>
        )}
      </Stack>
    </Box>
  );
};

const GameCommandCenter = ({
  state,
  actionLoading,
  onActivateGeofence,
  onDeactivateGeofence,
  t,
}) => {
  return (
    <Card variant="outlined" sx={{ borderRadius: 4 }}>
      <CardContent>
        <Stack spacing={2}>
          <GameSectionHeader
            icon={<SportsEsportsIcon />}
            title={t('gameManagementCommandTitle')}
            description={t('gameManagementCommandDescription')}
            color="info"
          />
          <Grid container spacing={1.25}>
            <Grid size={{ xs: 6 }}>
              <GameMetricBox
                icon={<PersonSearchIcon fontSize="small" />}
                label={t('gameActiveHunted')}
                value={getActiveHuntedMembers(state.members).length}
                color="success"
                minHeight={92}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <GameMetricBox
                icon={<WarningAmberIcon fontSize="small" />}
                label={t('gameCaughtHunted')}
                value={getCaughtHuntedMembers(state.members).length}
                color="error"
                minHeight={92}
              />
            </Grid>
          </Grid>
          <GameZonesPreviewCard
            state={state}
            actionLoading={actionLoading}
            onActivate={onActivateGeofence}
            onDeactivate={onDeactivateGeofence}
            t={t}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default GameCommandCenter;
