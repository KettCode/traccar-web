import { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from '../../common/components/LocalizationProvider';
import SelectField from '../../common/components/SelectField';
import EditItemView from '../../settings/components/EditItemView';
import SettingsMenu from '../../settings/components/SettingsMenu';
import useSettingsStyles from '../../settings/common/useSettingsStyles';
import GameLookupSelectField from './common/GameLookupSelectField';
import { fromDateTimeInput, toDateTimeInput } from './common/gameSettingsFormatters';

const defaultItem = {
  gameId: 0,
  geofenceId: 0,
  name: '',
  type: 'playfield',
  role: null,
  active: true,
};

const GameGeofencePage = () => {
  const { classes } = useSettingsStyles();
  const t = useTranslation();

  const [item, setItem] = useState();

  const validate = () => item && item.gameId > 0 && item.geofenceId > 0 && item.name && item.type;

  return (
    <EditItemView
      endpoint="gameGeofences"
      item={item}
      setItem={setItem}
      defaultItem={defaultItem}
      validate={validate}
      menu={<SettingsMenu />}
      breadcrumbs={['settingsTitle', 'gameGeofence']}
    >
      {item && (
        <>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">{t('sharedRequired')}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <SelectField
                value={item.gameId || 0}
                emptyValue={0}
                onChange={(event) => setItem({ ...item, gameId: Number(event.target.value) })}
                endpoint="/api/games?all=true"
                label={t('gameGame')}
              />
              <SelectField
                value={item.geofenceId || 0}
                emptyValue={0}
                onChange={(event) => setItem({ ...item, geofenceId: Number(event.target.value) })}
                endpoint="/api/geofences?all=true"
                label={t('sharedGeofence')}
              />
              <TextField
                value={item.name || ''}
                onChange={(event) => setItem({ ...item, name: event.target.value })}
                label={t('sharedName')}
              />
              <GameLookupSelectField
                lookup="geofenceTypes"
                value={item.type || null}
                onChange={(event) => setItem({ ...item, type: event.target.value })}
                label={t('sharedType')}
              />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">{t('gameDetails')}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <GameLookupSelectField
                lookup="memberRoles"
                value={item.role || null}
                emptyValue={null}
                onChange={(event) => setItem({ ...item, role: event.target.value })}
                label={t('gameRole')}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={!!item.active}
                    onChange={(event) => setItem({ ...item, active: event.target.checked })}
                  />
                }
                label={t('sharedActive')}
              />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">{t('gameTimestamps')}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <TextField
                type="datetime-local"
                value={toDateTimeInput(item.createdAt)}
                onChange={(event) =>
                  setItem({ ...item, createdAt: fromDateTimeInput(event.target.value) })
                }
                label={t('gameCreatedAt')}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                type="datetime-local"
                value={toDateTimeInput(item.updatedAt)}
                onChange={(event) =>
                  setItem({ ...item, updatedAt: fromDateTimeInput(event.target.value) })
                }
                label={t('gameUpdatedAt')}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </EditItemView>
  );
};

export default GameGeofencePage;
