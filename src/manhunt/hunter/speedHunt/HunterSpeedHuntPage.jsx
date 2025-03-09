import React, { useEffect, useState } from 'react';
import { useCatch, useEffectAsync } from '../../../reactHelper';
import SpeedHuntItem from './SpeedHuntItem';
import LocationItem from './LocationItem';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import Card from '../../components/Card';
import ManhuntsMenu from '../../components/ManhuntsMenu';
import useReportStyles from '../../../reports/common/useReportStyles';
import PageLayout from '../../../common/components/PageLayout';

const HunterSpeedHuntPage = () => {
  const [timestamp, setTimestamp] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const [manhuntInfo, setManhuntInfo] = useState({});
  const [showBack, setShowBack] = useState(false);
  const classes = useReportStyles();

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
    <PageLayout menu={<ManhuntsMenu />} breadcrumbs={['Manhunt', 'Speedhunt']}>
      <div className={classes.container} style={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        {manhuntInfo && (
          <>
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

export default HunterSpeedHuntPage;




