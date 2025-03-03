import React, { useEffect, useState } from 'react';
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
import DrawerButton from '../DrawerButton';
import SpeedHuntDrawer from './SpeedHuntDrawer';


dayjs.extend(utc);

const SpeedHunt = () => {
  const classes = useSettingsStyles();
  const t = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [timestamp, setTimestamp] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const [manhuntInfo, setManhuntInfo] = useState({});
  const [showBack, setShowBack] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);

  useEffectAsync(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/currentManhunt/getManhuntHunterInfo`);
      if (response.ok) {
        setManhuntInfo(await response.json());
      } else {
        throw Error(await response.text());
      }
    } finally {
      setLoading(false);
    }
  }, [timestamp]);

  useEffect(() => {
    setShowBack(manhuntInfo.isSpeedHuntRunning);
  }, [manhuntInfo.isSpeedHuntRunning])

  const onCreated = useCatch(async () => {
    setTimestamp(Date.now());
  });


  const cardFront = () => {
    return <>
      <DirectionsRunIcon className='card-depth-icon' />
      <div class="card-depth">
        <SpeedHuntItem
          speedHuntInfo={manhuntInfo}
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
          speedHuntInfo={manhuntInfo}
          onCreated={onCreated}
          reload={() => setTimestamp(Date.now())} />
      </div>
    </>
  }

  return (
    <PageLayout menu={<></>} breadcrumbs={['', '']}>
      <div maxWidth="xs" className={classes.container}
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
        {manhuntInfo && (
          <>
            <DrawerButton
              title={"Übersicht"}
              onClick={() => setEventsOpen(true)}
            />
            <SpeedHuntDrawer
              open={eventsOpen}
              onClose={() => setEventsOpen(false)}
              speedHuntInfo={manhuntInfo}
            />
            <Card
              cardFront={cardFront}
              cardBack={cardBack}
              showBack={showBack}
            />
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default SpeedHunt;




