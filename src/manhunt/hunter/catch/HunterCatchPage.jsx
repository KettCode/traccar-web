import React, { useState } from 'react';
import HttpsIcon from "@mui/icons-material/Https";
import CatchItem from './CatchItem';
import { useEffectAsync } from '../../../reactHelper';
import Card from '../../components/Card';
import PageLayout from '../../../common/components/PageLayout';
import ManhuntsMenu from '../../components/ManhuntsMenu';
import useReportStyles from '../../../reports/common/useReportStyles';

const HunterCatchPage = () => {
  const [timestamp, setTimestamp] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [showBack, setShowBack] = useState(false);
  const [manhuntInfo, setManhuntInfo] = useState({});
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
    <PageLayout menu={<ManhuntsMenu />} breadcrumbs={['Manhunt', 'Verhaften']}>
      <div className={classes.container} style={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        {items && (
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

export default HunterCatchPage;




