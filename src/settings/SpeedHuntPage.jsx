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
import EditAttributesAccordion from './components/EditAttributesAccordion';
import useCommonDeviceAttributes from '../common/attributes/useCommonDeviceAttributes';
import useDeviceAttributes from '../common/attributes/useDeviceAttributes';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import SelectField from '../common/components/SelectField';

dayjs.extend(utc);

const SpeedHuntPage = () => {
  const classes = useSettingsStyles();
  const t = useTranslation();
  const admin = useAdministrator();
  const commonDeviceAttributes = useCommonDeviceAttributes(t);
  const deviceAttributes = useDeviceAttributes(t);
  const [item, setItem] = useState();
  const validate = () => item && item.manhuntsId && item.hunterGroupId && item.deviceId && item.pos && item.lastTime;


  return (
    <EditItemView
      endpoint="speedHunts"
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
                    value={item.manhuntsId}
                    onChange={(event) => setItem({ ...item, manhuntsId: Number(event.target.value) })}
                    endpoint="/api/manhunts"
                    label={'Manhuntid'}
                    titleGetter={x => x.id}
                />
                <SelectField
                    value={item.hunterGroupId}
                    onChange={(event) => setItem({ ...item, hunterGroupId: Number(event.target.value) })}
                    endpoint="/api/groups"
                    label={t('groupParent')}
                />
                <SelectField
                  value={item.deviceId}
                  onChange={(event) => setItem({ ...item, deviceId: Number(event.target.value) })}
                  endpoint="/api/devices"
                  label={'Zielgerät'}
                />
                <TextField
                    label={'Anfragenummer'}
                    type="number"
                    value={item.pos}
                    onChange={(event) => setItem({ ...item, pos: Number(event.target.value) })}
                    disabled={!admin}
                />
                <TextField
                label={'Letzte Anfrage'}
                type="datetime-local"
                value={dayjs.utc(item.lastTime).local().format('YYYY-MM-DDTHH:mm')}
                onChange={(event) => setItem({ ...item, lastTime: dayjs(event.target.value).utc().format('YYYY-MM-DDTHH:mm') })}
                fullWidth
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

export default SpeedHuntPage;
