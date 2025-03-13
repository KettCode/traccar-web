import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useEffect, useState } from "react";
import { useEffectAsync } from "../reactHelper";
import PageLayout from "../common/components/PageLayout";
import useReportStyles from "../reports/common/useReportStyles";
import ManhuntsMenu from "./components/ManhuntsMenu";
import { Container, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { formatTime } from "../common/util/formatter";
import DevicesInfo from "./components/DevicesInfo";

const ManhuntInfoPage = () => {
    const classes = useReportStyles();

    const [timestamp, setTimestamp] = useState(Date.now());
    const [loading, setLoading] = useState(false);
    const [manhuntInfo, setManhuntInfo] = useState({});

    useEffectAsync(async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/currentManhunt/getManhuntInfo`);
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
        if (!manhuntInfo || !manhuntInfo.nextPosition)
            return;

        const targetTime = new Date(manhuntInfo.nextPosition).getTime();
        const currentTime = new Date().getTime();
        const timeDifference = targetTime - currentTime;

        const interval = setInterval(() => {
            clearInterval(interval);
            setTimestamp(Date.now());
        }, timeDifference);

        return () => clearInterval(interval);

    }, [manhuntInfo.nextPosition]);

    return (
        <PageLayout menu={<ManhuntsMenu />} breadcrumbs={['Manhunt', 'Info']}>
            <div className={classes.container} style={{
                position: "relative",
                height: "100%",
                width: "100%",
                display: "flex",
                alignItems: "center"
            }}>
                {manhuntInfo && (
                    <>
                        <Container maxWidth="xs" className={classes.container} style={{
                            height: "auto",
                            padding: "0px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "white"
                        }} sx={{
                            mt: 1,
                            mb: 2,
                            boxShadow: "0px 2px 1px -1px rgba(0, 0, 0, 0), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)"
                        }}>
                            <ListItem>
                                <ListItemIcon>
                                    <LocationOnIcon className='card-depth-icon' />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Nächste Standortmeldung"
                                    secondary={formatTime(manhuntInfo.nextPosition, 'minutes')}
                                />
                            </ListItem>
                        </Container>
                        <Container maxWidth="xs" className={classes.container} style={{
                            overflowY: "auto",
                            padding: "0px"
                        }}>
                            <DevicesInfo
                                manhuntInfo={manhuntInfo}
                                reload={() => setTimestamp(Date.now())}
                            />
                        </Container>
                    </>
                )}
            </div>
        </PageLayout>
    );
};

export default ManhuntInfoPage;