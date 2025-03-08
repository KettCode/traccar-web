import React, { useState } from 'react';
import HttpsIcon from "@mui/icons-material/Https";
import CatchItem from './CatchItem';
import { useEffectAsync } from '../../../reactHelper';
import Card from '../../components/Card';
import InfoDrawer from '../../components/InfoDrawer';
import PageLayout from '../../components/PageLayout';

const HunterCatchPage = () => {
  const [timestamp, setTimestamp] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [showBack, setShowBack] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);
  const [manhuntInfo, setManhuntInfo] = useState({});

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

  const cardFront = () => {
    return <>
      <HttpsIcon className='card-depth-icon' />
      <div class="card-depth">
        <CatchItem
          onCreated={() => setTimestamp(Date.now())}
          reload={() => setTimestamp(Date.now())}
        />
      </div>
    </>
  }

  const cardBack = () => {
    return null;
  }

  return (
    <PageLayout openEvents={() => setEventsOpen(true)}>
      {items && (
        <>
          <InfoDrawer
            open={eventsOpen}
            onClose={() => setEventsOpen(false)}
            manhuntInfo={manhuntInfo}
            showCatches={true}
            showSpeedHunts={false}
          />
          <Card
            cardFront={cardFront}
            cardBack={cardBack}
            showBack={showBack}
          />
        </>)
      }
    </PageLayout>
  );
};

export default HunterCatchPage;




