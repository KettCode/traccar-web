import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditItemView from './components/EditItemView';
import { useTranslation } from '../common/components/LocalizationProvider';
import { useAdministrator } from '../common/util/permissions';
import SettingsMenu from './components/SettingsMenu';
import useSettingsStyles from './common/useSettingsStyles';
import useCommonDeviceAttributes from '../common/attributes/useCommonDeviceAttributes';
import useDeviceAttributes from '../common/attributes/useDeviceAttributes';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useCatch } from '../reactHelper';
import SelectField from '../common/components/SelectField';

dayjs.extend(utc);

const ManhuntPage = () => {
  const { classes } = useSettingsStyles();
  const t = useTranslation();
  const admin = useAdministrator();
  const commonDeviceAttributes = useCommonDeviceAttributes(t);
  const deviceAttributes = useDeviceAttributes(t);
  const [item, setItem] = useState();
  const [selectedGeofence, setSelectedGeofence] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const validate = () => item && item.start && item.frequency && item.speedHuntLimit && item.locationRequestLimit;

  const handleAddGeofence = useCatch(async () => {
    if (!selectedGeofence) return;
  
    const url = `/api/currentManhunt/assignGeofenceToAllUsers?geofenceId=${selectedGeofence}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  
    if (response.ok) {
      setSnackbarOpen(true);
    } else {
      throw new Error(await response.text());
    }
  });
  
  const handleRemoveGeofence = useCatch(async () => {
    if (!selectedGeofence) return;
  
    const url = `/api/currentManhunt/removeGeofenceFromAllUsers?geofenceId=${selectedGeofence}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  
    if (response.ok) {
      setSnackbarOpen(true);
    } else {
      throw new Error(await response.text());
    }
  });

  return (
    <EditItemView
      endpoint="manhunts"
      item={item}
      setItem={setItem}
      validate={validate}
      menu={<SettingsMenu />}
      breadcrumbs={['settingsTitle', 'sharedDevice']}
    >
      {item && (
        <>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">
                {'Manhunt'}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <TextField
                label={'Start'}
                type="datetime-local"
                value={dayjs.utc(item.start).local().format('YYYY-MM-DDTHH:mm')}
                onChange={(event) => setItem({ ...item, start: dayjs(event.target.value).utc().format('YYYY-MM-DDTHH:mm') })}
                fullWidth
                disabled={!admin}
              />
              <TextField
                label={'Frequenz'}
                type="number"
                value={item.frequency}
                onChange={(event) => setItem({ ...item, frequency: Number(event.target.value) })}
                disabled={!admin}
              />
              <TextField
                label={'Speedhunts'}
                type="number"
                value={item.speedHuntLimit}
                onChange={(event) => setItem({ ...item, speedHuntLimit: Number(event.target.value) })}
                disabled={!admin}
              />
              <TextField
                label={'Anfragen pro Speedhunt'}
                type="number"
                value={item.locationRequestLimit}
                onChange={(event) => setItem({ ...item, locationRequestLimit: Number(event.target.value) })}
                disabled={!admin}
              />
              <TextField
                label={'Erinnerung bei fehlendem Standortupdate'}
                type="number"
                value={item.locationUpdateReminderSeconds}
                onChange={(event) => setItem({ ...item, locationUpdateReminderSeconds: Number(event.target.value) })}
                disabled={!admin}
              />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">
                {'Einstellungen'}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <SelectField
                value={selectedGeofence}
                onChange={(event) => setSelectedGeofence(Number(event.target.value))}
                endpoint="/api/geofences"
                label={t('sharedGeofence')}
                fullWidth={true}
              />
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleRemoveGeofence}
                  disabled={!selectedGeofence}
                >
                  Entfernen
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleAddGeofence}
                  disabled={!selectedGeofence}
                >
                  Hinzufügen
                </Button>
              </div>
              <Snackbar
                  open={snackbarOpen}
                  autoHideDuration={4000}
                  onClose={() => setSnackbarOpen(false)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              >
                  <Alert
                      onClose={() => setSnackbarOpen(false)}
                      severity={"success"}
                      variant="filled"
                  >
                      {"Erfolgreich gespeichert."}
                  </Alert>
              </Snackbar>
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </EditItemView>
  );
};

export default ManhuntPage;
