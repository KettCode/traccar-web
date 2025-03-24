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

const ManhuntPage = () => {
  const classes = useSettingsStyles();
  const t = useTranslation();
  const admin = useAdministrator();
  const commonDeviceAttributes = useCommonDeviceAttributes(t);
  const deviceAttributes = useDeviceAttributes(t);
  const [item, setItem] = useState();
  const validate = () => item && item.start;


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
                {'Standort'}
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
                value={item.speedHunts}
                onChange={(event) => setItem({ ...item, speedHunts: Number(event.target.value) })}
                disabled={!admin}
              />
              <TextField
                label={'Anfragen pro Speedhunt'}
                type="number"
                value={item.locationRequests}
                onChange={(event) => setItem({ ...item, locationRequests: Number(event.target.value) })}
                disabled={!admin}
              />
            </AccordionDetails>
          </Accordion>
          <EditAttributesAccordion
            attributes={item.attributes}
            setAttributes={(attributes) => setItem({ ...item, attributes })}
            definitions={{ ...commonDeviceAttributes, ...deviceAttributes }}
          />
        </>
      )}
    </EditItemView>
  );
};

export default ManhuntPage;
