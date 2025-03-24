import React, { useState } from 'react';
import { useEffectAsync } from '../reactHelper';
import ManhuntsMenu from './components/ManhuntsMenu';
import useReportStyles from '../reports/common/useReportStyles';
import PageLayout from '../common/components/PageLayout';
import { Accordion, AccordionDetails, AccordionSummary, Box, Container, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import SpeedHuntCard from './components/SpeedHuntCard';
import { formatTime } from '../common/util/formatter';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";


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
            {user.manhuntRole == 1 && speedHuntInfo.speedHunts && speedHuntInfo.speedHunts.length > 0 && (
              <Container maxWidth="xs" className={classes.container} style={{
                height: "50%",
                overflowY: "auto",
                padding: "0px"
              }}>
                {speedHuntInfo.speedHunts.map((speedHunt) => (
                  <SpeedHuntItem
                    key={speedHunt.id}  // Make sure to use a unique key
                    speedHunt={speedHunt}
                  />
                )
                )}
              </Container>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
};

const SpeedHuntItem = ({
  speedHunt
}) => {
  const classes = useReportStyles();

  return <Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Box display="flex" alignItems="center">
        <DirectionsRunIcon sx={{
          mr: 1
        }} />
        <Typography variant="subtitle1">
          {`Speedhunt auf ${speedHunt.deviceName}`}
        </Typography>
      </Box>
    </AccordionSummary>
    <AccordionDetails className={classes.details}>
      {speedHunt.speedHuntRequests && speedHunt.speedHuntRequests.map((speedHuntRequests) => (
        <Box display="flex" alignItems="center" marginLeft={"30px"} key={speedHuntRequests.id} >
          <LocationOnIcon sx={{
            mr: 1
          }} />
          <Typography variant="subtitle1">
            {formatTime(speedHuntRequests.time, 'minutes')}
          </Typography>
        </Box>

      ))}
    </AccordionDetails>
  </Accordion >
}

export default SpeedHuntsPage;




