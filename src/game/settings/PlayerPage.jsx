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
import { fromDateTimeInput, toDateTimeInput } from './common/gameSettingsFormatters';

const defaultItem = { name: '', userId: 0, deviceId: 0, active: true };

const PlayerPage = () => {
  const { classes } = useSettingsStyles();
  const t = useTranslation();

  const [item, setItem] = useState();

  const validate = () => item && item.name?.trim() && item.userId > 0 && item.deviceId > 0;

  return (
    <EditItemView
      endpoint="players"
      item={item}
      setItem={setItem}
      defaultItem={defaultItem}
      validate={validate}
      menu={<SettingsMenu />}
      breadcrumbs={['settingsTitle', 'gamePlayer']}
    >
      {item && (
        <>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">{t('sharedRequired')}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <TextField
                value={item.name || ''}
                onChange={(event) => setItem({ ...item, name: event.target.value })}
                label={t('sharedName')}
              />
              <SelectField
                value={item.userId || 0}
                emptyValue={0}
                onChange={(event) => setItem({ ...item, userId: Number(event.target.value) })}
                endpoint="/api/users"
                label={t('settingsUser')}
              />
              <SelectField
                value={item.deviceId || 0}
                emptyValue={0}
                onChange={(event) => setItem({ ...item, deviceId: Number(event.target.value) })}
                endpoint="/api/devices?all=true"
                label={t('sharedDevice')}
              />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">{t('gameDetails')}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
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

export default PlayerPage;
