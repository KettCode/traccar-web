import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import useSettingsStyles from '../../settings/common/useSettingsStyles';
import { formatTime } from '../../common/util/formatter';
import { useSelector } from 'react-redux';

const SpeedHunts = ({
    manhunt
}) => {
    const { classes } = useSettingsStyles();
    
    return <>
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" alignItems="center">
                    <DirectionsRunIcon sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">
                        {`Speedhunts`}
                    </Typography>
                </Box>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
                {manhunt.speedHunts && manhunt.speedHunts.map((speedHunt) => (
                    <SpeedHuntItem
                        key={speedHunt.id}
                        speedHunt={speedHunt}
                    />
                ))}
            </AccordionDetails>
        </Accordion >
    </>
}

const SpeedHuntItem = ({
    speedHunt
}) => {
    const { classes } = useSettingsStyles();
    const devices = useSelector((state) => state.devices.items);

    return <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center">
                <PersonSearchIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle1">
                    {`${devices[speedHunt.deviceId]?.name ?? "Unbekannt"}`}
                </Typography>
            </Box>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
            {speedHunt.locationRequests && speedHunt.locationRequests.map((locationRequests) => (
                <Box display="flex" alignItems="center" marginLeft={"30px"} key={locationRequests.id} >
                    <LocationOnIcon sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">
                        {formatTime(locationRequests.time, 'minutes')}
                    </Typography>
                </Box>
            ))}
        </AccordionDetails>
    </Accordion >
}

export default SpeedHunts;