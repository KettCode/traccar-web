import React, { useEffect, useState } from 'react';
import {
  Container
} from '@mui/material';
import { useTranslation } from '../../common/components/LocalizationProvider';
import useSettingsStyles from '../../settings/common/useSettingsStyles';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import PageLayout from '../../common/components/PageLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { useCatch, useEffectAsync } from '../../reactHelper';
import SpeedHuntItem from './SpeedHuntItem';
import LocationItem from './LocationItem';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import Card from '../Card';


dayjs.extend(utc);

const SpeedHunt = () => {
  const [timestamp, setTimestamp] = useState(Date.now());
  const classes = useSettingsStyles();
  const t = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [speedHuntInfo, setSpeedHuntInfo] = useState({});
  const [showBack, setShowBack] = useState(false);

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

  useEffect(() => {
    setShowBack(speedHuntInfo.isSpeedHuntRunning);
  }, [speedHuntInfo.isSpeedHuntRunning])

  const onCreated = useCatch(async () => {
    setTimestamp(Date.now());
  });


  const cardFront = () => {
    return <>
      <DirectionsRunIcon className='card-depth-icon' />
      <div class="card-depth">
        <SpeedHuntItem
          speedHuntInfo={speedHuntInfo}
          onCreated={onCreated}
          reload={() => setTimestamp(Date.now())} />
      </div>
    </>
  }

  const cardBack = () => {
    return <>
      <LocationOnIcon className='card-depth-icon' />
      <div class="card-depth">
        <LocationItem
          speedHuntInfo={speedHuntInfo}
          onCreated={onCreated}
          reload={() => setTimestamp(Date.now())} />
      </div>
    </>
  }

  return (
    <PageLayout menu={<></>} breadcrumbs={['', '']}>
      <Container maxWidth="xs" className={classes.container}
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
        {speedHuntInfo && (
          <>
            <Card
              cardFront={cardFront}
              cardBack={cardBack}
              showBack={showBack}
            />
          </>
        )}
      </Container>
    </PageLayout>
  );
};

export default SpeedHunt;




