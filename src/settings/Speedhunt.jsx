import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Container,
  Button,
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
import PageLayout from '../common/components/PageLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { useCatch, useEffectAsync } from '../reactHelper';

dayjs.extend(utc);

const Speedhunt = () => {
  const classes = useSettingsStyles();
  const t = useTranslation();
  const [item, setItem] = useState({});
  const validate = () => item && item.deviceId;
  const navigate = useNavigate();
  const { id } = useParams();

  // useEffectAsync(async () => {
  //   if (!item) {
  //     if (id) {
  //       const response = await fetch(`/api/${endpoint}/${id}`);
  //       if (response.ok) {
  //         setItem(await response.json());
  //       } else {
  //         throw Error(await response.text());
  //       }
  //     } else {
  //       setItem(defaultItem || {});
  //     }
  //   }
  // }, [id, item, defaultItem]);

  const create = useCatch(async () => {
    let url = `/api/speedhunts/create`;

    item.lastTime = dayjs.utc().format();
    
    const response = await fetch(url, {
      method: !id ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });

    if (response.ok) {
      // if (onItemSaved) {
      //   onItemSaved(await response.json());
      // }
      //navigate(-1);
    } else {
      throw Error(await response.text());
    }
  });

  const trigger = useCatch(async () => {
    let url = `/api/${endpoint}`;
    if (id) {
      url += `/${id}`;
    }

    item.time = dayjs.utc().format();

    const response = await fetch(url, {
      method: !id ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });

    if (response.ok) {
      // if (onItemSaved) {
      //   onItemSaved(await response.json());
      // }
      // navigate(-1);
    } else {
      throw Error(await response.text());
    }
  });


  return (
    <PageLayout menu={<SettingsMenu />} breadcrumbs={['settingsTitle', 'sharedDevice']}>
      <Container maxWidth="xs" className={classes.container}>
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
              </AccordionDetails>
            </Accordion>
          </>
        )}
        <div className={classes.buttons}>
          <Button
            type="button"
            color="primary"
            variant="outlined"
            onClick={() => navigate(-1)}
            disabled={!item}
          >
            {t('sharedCancel')}
          </Button>
          <Button
            type="button"
            color="primary"
            variant="contained"
            onClick={create}
            disabled={!item || !validate()}
          >
            {'Starten'}
          </Button>
          <Button
            type="button"
            color="primary"
            variant="contained"
            onClick={create}
            disabled={!item || !validate()}
          >
            {'Triggern'}
          </Button>
        </div>
      </Container>
    </PageLayout>
  );
};

export default Speedhunt;
