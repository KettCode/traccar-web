import React, { useState } from 'react';
import { useEffectAsync } from '../reactHelper';
import ManhuntsMenu from './components/ManhuntsMenu';
import useReportStyles from '../reports/common/useReportStyles';
import PageLayout from '../common/components/PageLayout';
import { Container, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import SpeedHuntsItems from './components/SpeedHuntsItems';
import SpeedHuntCard from './components/SpeedHuntCard';


const SpeedHuntsPage = () => {
  const [timestamp, setTimestamp] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const [speedHuntInfo, setSpeedHuntInfo] = useState({});
  const classes = useReportStyles();
  const user = useSelector((state) => state.session.user);

  useEffectAsync(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/currentManhunt/getSpeedHuntInfo`);
      if (response.ok) {
        setSpeedHuntInfo(await response.json());
      } else {
        throw Error(await response.text());
      }
    } finally {
      setLoading(false);
    }
  }, [timestamp]);

  return (
    <PageLayout menu={<ManhuntsMenu />} breadcrumbs={['Manhunt', 'Speedhunts']}>
      <div className={classes.container} style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center"
      }}>
        {speedHuntInfo && (
          <>
            <Container maxWidth="xs" className={classes.container} style={{
              height: "50%",
              padding: "0px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <SpeedHuntCard
                speedHuntInfo={speedHuntInfo}
                reload={() => setTimestamp(Date.now())}
              />
            </Container>
            {speedHuntInfo.speedHunts && speedHuntInfo.speedHunts.length > 0 && (
              <Container maxWidth="xs" className={classes.container} style={{
                height: "50%",
                overflowY: "auto",
                padding: "0px"
              }}>
                <SpeedHuntsItems speedHuntInfo={speedHuntInfo} />
              </Container>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default SpeedHuntsPage;




