import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import { formatTime } from '../../common/util/formatter';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import useReportStyles from '../../reports/common/useReportStyles';

const SpeedHuntsItems = ({ speedHuntInfo }) => {
    return (
        <>
            {speedHuntInfo.speedHunts && speedHuntInfo.speedHunts.map((speedHunt) => {
                return (
                    <SpeedHuntItem
                        key={speedHunt.id}  // Make sure to use a unique key
                        speedHuntInfo={speedHuntInfo}
                        speedHunt={speedHunt}
                    />
                );
            })}
        </>
    );
}

const SpeedHuntItem = ({
    speedHuntInfo,
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
                    {`Speedhunt auf ${speedHuntInfo.devices.find(x => x.id == speedHunt.deviceId)?.name}`}
                </Typography>
            </Box>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
            {speedHunt.speedHuntRequests && speedHunt.speedHuntRequests.map((speedHuntRequests) => (
                <Box display="flex" alignItems="center" marginLeft={"30px"}>
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

export default SpeedHuntsItems;