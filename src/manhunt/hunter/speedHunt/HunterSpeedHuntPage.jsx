import React, { useEffect, useState } from 'react';
import { useCatch, useEffectAsync } from '../../../reactHelper';
import SpeedHuntItem from './SpeedHuntItem';
import LocationItem from './LocationItem';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import Card from '../../components/Card';
import InfoDrawer from '../../components/InfoDrawer';
import PageLayout from '../../components/PageLayout';

const HunterSpeedHuntPage = () => {
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
    <PageLayout
      title={"Speedhunts"}
      openEvents={() => setEventsOpen(true)}
    >
      {manhuntInfo && (
        <>
          <InfoDrawer
            open={eventsOpen}
            onClose={() => setEventsOpen(false)}
            manhuntInfo={manhuntInfo}
            showCatches={false}
            showSpeedHunts={true}
          />
          <Card
            cardFront={cardFront}
            cardBack={cardBack}
            showBack={showBack}
          />
        </>
      )}
    </PageLayout>
  );
};

export default HunterSpeedHuntPage;




