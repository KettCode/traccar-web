import { useState } from "react";
import { useEffectAsync } from "../../reactHelper";
import { Accordion, AccordionDetails, AccordionSummary, Box, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import PageLayout from "../../common/components/PageLayout";
import useReportStyles from "../../reports/common/useReportStyles";
import ManhuntsMenu from "../components/ManhuntsMenu";
import { formatTime } from "../../common/util/formatter";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const SpeedHuntsInfoPage = () => {
    const theme = useTheme();
    const [timestamp, setTimestamp] = useState(Date.now());
    const [loading, setLoading] = useState(false);
    const [manhuntInfo, setManhuntInfo] = useState({});
    const [showBack, setShowBack] = useState(false);
    const desktop = useMediaQuery(theme.breakpoints.up('md'));
    const classes = useReportStyles();


    useEffectAsync(async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/currentManhunt/getManhuntHuntedInfo`);
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
        <PageLayout menu={<ManhuntsMenu />} breadcrumbs={['Manhunt', 'Speedhunts (Info)']}>
            <div className={classes.container} style={{
                height: "100%",
                width: "100%",
                display: "flex"
            }}>
                {manhuntInfo.speedHunts && manhuntInfo.speedHunts.map((speedHunt) => (
                    <>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box display="flex" alignItems="center">
                                    <DirectionsRunIcon />
                                    <Typography variant="subtitle1">
                                        {`Speedhunt auf ${manhuntInfo.devices.find(x => x.id == speedHunt.deviceId)?.name}`}
                                    </Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails className={classes.details}>
                                {speedHunt.speedHuntRequests && speedHunt.speedHuntRequests.map((speedHuntRequests) => (
                                    <Box display="flex" alignItems="center" marginLeft={"30px"}>
                                        <LocationOnIcon />
                                        <Typography variant="subtitle1">
                                            {formatTime(speedHuntRequests.time, 'minutes')}
                                        </Typography>
                                    </Box>

                                ))}
                            </AccordionDetails>
                        </Accordion >
                    </>
                ))}
                {manhuntInfo.speedHunts && manhuntInfo.speedHunts.length == 0 &&
                    <Typography variant="subtitle1" padding={"20px"} textAlign={"center"}>
                        {"Es gibt noch keine Speedhunts"}
                    </Typography>
                }
            </div>
        </PageLayout >
    );
};

export default SpeedHuntsInfoPage;