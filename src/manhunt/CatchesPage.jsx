import React, { useState } from 'react';
import { useEffectAsync } from '../reactHelper';
import PageLayout from '../common/components/PageLayout';
import ManhuntsMenu from './components/ManhuntsMenu';
import useReportStyles from '../reports/common/useReportStyles';
import { Container } from '@mui/material';
import { useSelector } from 'react-redux';
import HunterCatchCard from './cards/HunterCatchCard';
import HuntedCatchCard from './cards/HuntedCatchCard';
import CatchesItems from './items/CatchesItems';

const CatchesPage = () => {
  const [timestamp, setTimestamp] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const [manhuntInfo, setManhuntInfo] = useState({});
  const classes = useReportStyles();
  const user = useSelector((state) => state.session.user);

  useEffectAsync(async () => {
    setLoading(true);
    try {
      let url = `/api/currentManhunt/getManhuntHunterInfo`;
      if (user.group.manhuntRole == 2)
        url = `/api/currentManhunt/getManhuntHuntedInfo`;
      const response = await fetch(url);
      if (response.ok) {
        setManhuntInfo(await response.json());
      } else {
        throw Error(await response.text());
      }
    } finally {
      setLoading(false);
    }
  }, [timestamp]);

  return (
    <PageLayout menu={<ManhuntsMenu />} breadcrumbs={['Manhunt', 'Verhaften']}>
      <div className={classes.container} style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center"
      }}>
        {manhuntInfo && (
          <>
            <Container maxWidth="xs" className={classes.container} style={{
              height: "50%",
              padding: "0px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
              {user.group?.manhuntRole == 1 && (
                <HunterCatchCard
                  reload={() => setTimestamp(Date.now())}
                />
              )}
              {user.group?.manhuntRole == 2 && (
                <HuntedCatchCard
                  manhuntInfo={manhuntInfo}
                />
              )}
            </Container>
            {manhuntInfo.catches && manhuntInfo.catches.length > 0 && (
              <Container maxWidth="xs" className={classes.container} style={{
                height: "50%",
                overflowY: "auto",
                padding: "0px"
              }}>
                <CatchesItems manhuntInfo={manhuntInfo} />
              </Container>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default CatchesPage;




