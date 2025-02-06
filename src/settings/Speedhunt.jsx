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
import SelectField from '../common/components/SelectField';
import { useTranslation } from '../common/components/LocalizationProvider';
import { useAdministrator } from '../common/util/permissions';
import SettingsMenu from './components/SettingsMenu';
import useSettingsStyles from './common/useSettingsStyles';
import EditAttributesAccordion from './components/EditAttributesAccordion';
import useCommonDeviceAttributes from '../common/attributes/useCommonDeviceAttributes';
import useDeviceAttributes from '../common/attributes/useDeviceAttributes';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const SpeedhuntPage = () => {
  const classes = useSettingsStyles();
  const t = useTranslation();
  const admin = useAdministrator();
  const commonDeviceAttributes = useCommonDeviceAttributes(t);
  const deviceAttributes = useDeviceAttributes(t);
  const [item, setItem] = useState();
  const validate = () => item && item.manhuntsId && item.deviceId && item.userId;


  return (
    <EditItemView
      endpoint="speedhunts"
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
                {'Standort'}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <SelectField
                value={item.deviceId}
                onChange={(event) => setItem({ ...item, deviceId: Number(event.target.value) })}
                endpoint="/api/devices"
                label={'Zielgerät'}
              />
              <TextField
                label={'Lasttime'}
                type="datetime-local"
                value={dayjs.utc(item.time).local().format('YYYY-MM-DDTHH:mm')}
                onChange={(event) => setItem({ ...item, time: dayjs(event.target.value).utc().format('YYYY-MM-DDTHH:mm') })}
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

export default SpeedhuntPage;
