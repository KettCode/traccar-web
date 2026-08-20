import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DrawIcon from '@mui/icons-material/Draw';
import EditIcon from '@mui/icons-material/Edit';
import CollectionActions from '../../../settings/components/CollectionActions';
import { useTranslation } from '../../../common/components/LocalizationProvider';
import { getLookupLabel } from './setupWizardUtils';

const SetupGeofencesStep = ({ wizard }) => {
  const t = useTranslation();
  const geofences = wizard.state?.geofences || [];

  const geofenceActions = (item) => (
    <CollectionActions
      itemId={item.id}
      endpoint={`setup/games/${wizard.gameId}/geofences`}
      onReload={wizard.reload}
      readonly={!wizard.editable}
      customActions={
        wizard.editable
          ? [
              {
                key: 'edit',
                title: t('sharedEdit'),
                icon: <EditIcon fontSize="small" />,
                handler: wizard.openEditGeofence,
              },
            ]
          : undefined
      }
    />
  );

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h6">{t('sharedGeofence')}</Typography>
        <Typography variant="body2" color="text.secondary">
          {t('gameSetupGeofencesDescription')}
        </Typography>
      </Box>
      {!wizard.gameId && <Alert severity="info">{t('gameSetupSaveGameFirst')}</Alert>}
      {!!wizard.gameId && (
        <>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={wizard.openNewGeofence}
              disabled={!wizard.editable}
            >
              {t('gameSetupAddExistingGeofence')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<DrawIcon />}
              onClick={wizard.openDrawGeofence}
              disabled={!wizard.editable}
            >
              {t('gameSetupDrawGeofence')}
            </Button>
          </Stack>
          {!geofences.length && <Alert severity="info">{t('gameSetupNoGeofences')}</Alert>}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
              gap: 1.5,
            }}
          >
            {geofences.map((item) => (
              <Card key={item.id} variant="outlined">
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" spacing={2}>
                    <Box>
                      <Typography variant="subtitle1">{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {getLookupLabel(wizard.state.availableRoles, item.role) || t('sharedAll')}
                      </Typography>
                    </Box>
                    <Stack
                      direction="row"
                      spacing={0.75}
                      flexWrap="wrap"
                      justifyContent="flex-end"
                      useFlexGap
                    >
                      <Chip
                        size="small"
                        label={getLookupLabel(wizard.state.availableGeofenceTypes, item.type)}
                      />
                      <Chip
                        size="small"
                        color={item.active ? 'success' : 'default'}
                        label={item.active ? t('sharedActive') : t('sharedDisabled')}
                      />
                    </Stack>
                  </Stack>
                </CardContent>
                <CardActions>{geofenceActions(item)}</CardActions>
              </Card>
            ))}
          </Box>
        </>
      )}
    </Stack>
  );
};

export default SetupGeofencesStep;
