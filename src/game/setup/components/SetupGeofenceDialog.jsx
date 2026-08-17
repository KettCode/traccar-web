import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Stack,
  TextField,
} from '@mui/material';
import { useTranslation } from '../../../common/components/LocalizationProvider';
import SelectField from '../../../common/components/SelectField';

const SetupGeofenceDialog = ({ wizard }) => {
  const t = useTranslation();

  return (
    <Dialog
      open={wizard.geofenceDialog}
      onClose={() => wizard.setGeofenceDialog(false)}
      fullWidth
      maxWidth="xs"
    >
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {!wizard.editingGeofenceId && (
            <SelectField
              endpoint="/api/geofences?all=true"
              value={wizard.geofence.geofenceId || 0}
              emptyValue={0}
              onChange={(event) =>
                wizard.setGeofence({ ...wizard.geofence, geofenceId: Number(event.target.value) })
              }
              label={t('sharedGeofence')}
              fullWidth
            />
          )}
          <TextField
            value={wizard.geofence.name}
            onChange={(event) =>
              wizard.setGeofence({ ...wizard.geofence, name: event.target.value })
            }
            label={t('sharedName')}
            fullWidth
          />
          <SelectField
            data={wizard.state?.availableGeofenceTypes || []}
            keyGetter={(item) => item.value}
            titleGetter={(item) => item.label}
            value={wizard.geofence.type}
            onChange={(event) =>
              wizard.setGeofence({ ...wizard.geofence, type: event.target.value })
            }
            label={t('sharedType')}
            fullWidth
          />
          <SelectField
            data={wizard.state?.availableRoles || []}
            keyGetter={(item) => item.value}
            titleGetter={(item) => item.label}
            value={wizard.geofence.role}
            emptyValue={null}
            onChange={(event) =>
              wizard.setGeofence({ ...wizard.geofence, role: event.target.value })
            }
            label={t('gameRole')}
            fullWidth
          />
          <FormControlLabel control={<Checkbox checked readOnly />} label={t('sharedActive')} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => wizard.setGeofenceDialog(false)}>{t('sharedCancel')}</Button>
        <Button variant="contained" onClick={wizard.saveGeofence} disabled={!isValid(wizard)}>
          {t('sharedSave')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const isValid = (wizard) =>
  !!wizard.geofence.name &&
  !!wizard.geofence.type &&
  (!!wizard.editingGeofenceId || !!wizard.geofence.geofenceId);

export default SetupGeofenceDialog;
