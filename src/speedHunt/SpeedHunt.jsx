import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  Button,
  TextField,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SelectField from '../common/components/SelectField';
import { useTranslation } from '../common/components/LocalizationProvider';
import SettingsMenu from '../settings/components/SettingsMenu';
import useSettingsStyles from '../settings/common/useSettingsStyles';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import PageLayout from '../common/components/PageLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { useCatch, useEffectAsync } from '../reactHelper';
import { useSelector } from 'react-redux';

dayjs.extend(utc);

const SpeedHunt = () => {
  const [timestamp, setTimestamp] = useState(Date.now());
  const classes = useSettingsStyles();
  const t = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [item, setItem] = useState({});
  const [loading, setLoading] = useState(false);
  const [speedHuntInfo, setSpeedHuntInfo] = useState();
  const validate = () => item && item.deviceId;


  useEffectAsync(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/speedHunts/speedHuntInfo`);
      if (response.ok) {
        setSpeedHuntInfo(await response.json());
      } else {
        throw Error(await response.text());
      }
    } finally {
      setLoading(false);
    }
  }, [timestamp]);

  const create = useCatch(async () => {
    let url = `/api/speedHunts/create?deviceId=${item.deviceId}`;

    const response = await fetch(url, {
      method: !id ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });

    if (response.ok) {
      setTimestamp(Date.now());
    } else {
      throw Error(await response.text());
    }
  });

  const triggerNext = useCatch(async () => {
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

  let lastSpeedHunt = {};
  if (speedHuntInfo && speedHuntInfo.speedHunts)
    lastSpeedHunt = speedHuntInfo.speedHunts[speedHuntInfo.speedHunts.length - 1];

  return (
    <PageLayout menu={<></>} breadcrumbs={['settingsTitle', 'sharedDevice']}>
      <Container maxWidth="xs" className={classes.container}>
        {speedHuntInfo && (
          <>
            {
              speedHuntInfo.isSpeedHuntRunning ? <>
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">
                      {'Standort anfragen'}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails className={classes.details}>
                    <SelectField
                      value={lastSpeedHunt.deviceId}
                      endpoint="/api/manhunts/huntedDevices"
                      label={'Zielgerät'}
                      disabled={true}
                    />
                    <TextField
                      label={'Standortanfragen'}
                      value={`${lastSpeedHunt.speedHuntRequests.length}/${speedHuntInfo.group.speedHuntRequests}`}
                      disabled={true}
                    />
                    <Button
                      type="button"
                      color="primary"
                      variant="contained"
                      onClick={triggerNext}
                    >
                      {'Standort anfragen'}
                    </Button>
                  </AccordionDetails>
                </Accordion>
              </> : <>
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">
                      {'Speedhunt anfragen'}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails className={classes.details}>
                    <SelectField
                      value={item.deviceId}
                      onChange={(event) => setItem({ ...item, deviceId: Number(event.target.value) })}
                      endpoint="/api/manhunts/huntedDevices"
                      label={'Zielgerät'}
                    />
                    <TextField
                      label={'Speedhuntanfragen'}
                      value={`${speedHuntInfo.speedHunts.length}/${speedHuntInfo.group.speedHunts}`}
                      disabled={true}
                    />
                    <Button
                      type="button"
                      color="primary"
                      variant="contained"
                      onClick={create}
                      disabled={!validate()}
                    >
                      {'Speedhunt starten'}
                    </Button>
                  </AccordionDetails>
                </Accordion>
              </>
            }
          </>
        )}
      </Container>
    </PageLayout>
  );
};

export default SpeedHunt;
