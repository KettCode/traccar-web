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

const LocationRequestPage = () => {
  const classes = useSettingsStyles();
  const t = useTranslation();
  const admin = useAdministrator();
  const commonDeviceAttributes = useCommonDeviceAttributes(t);
  const deviceAttributes = useDeviceAttributes(t);
  const [item, setItem] = useState();
  const validate = () => item && item.speedHuntsId && item.userId && item.time;


  return (
    <EditItemView
      endpoint="locationRequests"
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
                    value={item.speedHuntsId}
                    onChange={(event) => setItem({ ...item, speedHuntsId: Number(event.target.value) })}
                    endpoint="/api/speedHunts?all=true"
                    label={'Speedhuntid'}
                    titleGetter={x => x.id}
                />
                <SelectField
                    value={item.userId}
                    onChange={(event) => setItem({ ...item, userId: Number(event.target.value) })}
                    endpoint="/api/users"
                    label={'Anfragesteller (Benutzer)'}
                />
                <TextField
                  label={'Angefragt am'}
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

export default LocationRequestPage;
