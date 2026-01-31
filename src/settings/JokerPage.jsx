import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
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
import SelectField from '../common/components/SelectField';

dayjs.extend(utc);

const JokerPage = () => {
  const { classes } = useSettingsStyles();
  const t = useTranslation();
  const admin = useAdministrator();
  const commonDeviceAttributes = useCommonDeviceAttributes(t);
  const deviceAttributes = useDeviceAttributes(t);
  const [item, setItem] = useState();
  const validate = () => item && item.manhuntsId && item.userId && item.jokerTypeId && item.status;


  return (
    <EditItemView
      endpoint="jokers"
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
                {'Joker'}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <SelectField
                value={item.manhuntsId}
                onChange={(event) => setItem({ ...item, manhuntsId: Number(event.target.value) })}
                endpoint="/api/manhunts"
                label={'Manhuntid'}
                titleGetter={x => x.id}
              />
              <SelectField
                value={item.userId}
                onChange={(event) => setItem({ ...item, userId: Number(event.target.value) })}
                endpoint="/api/users"
                label={t('settingsUsers')}
              />
              <SelectField
                value={item.jokerTypeId}
                onChange={(event) => setItem({ ...item, jokerTypeId: Number(event.target.value) })}
                endpoint="/api/jokers/getJokerTypes"
                label={'Joker'}
              />
              <SelectField
                value={item.status}
                onChange={(event) => setItem({ ...item, status: Number(event.target.value) })}
                endpoint="/api/jokers/getJokerStates"
                label={'Status'}
              />
              <TextField
                label={'Freigeschaltet um'}
                type="datetime-local"
                value={dayjs.utc(item.unlockedAt).local().format('YYYY-MM-DDTHH:mm')}
                onChange={(event) => setItem({ ...item, unlockedAt: dayjs(event.target.value).utc().format('YYYY-MM-DDTHH:mm') })}
                fullWidth
                disabled={!admin}
              />
              <TextField
                label={'Eingesetzt um'}
                type="datetime-local"
                value={dayjs.utc(item.usedAt).local().format('YYYY-MM-DDTHH:mm')}
                onChange={(event) => setItem({ ...item, usedAt: dayjs(event.target.value).utc().format('YYYY-MM-DDTHH:mm') })}
                fullWidth
                disabled={!admin}
              />
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </EditItemView>
  );
};

export default JokerPage;
