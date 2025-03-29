import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useEffect, useState } from "react";
import { useEffectAsync } from "../reactHelper";
import PageLayout from "../common/components/PageLayout";
import useReportStyles from "../reports/common/useReportStyles";
import ManhuntsMenu from "./components/ManhuntsMenu";
import { Container, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { formatTime } from "../common/util/formatter";
import Devices from "./components/Devices";

const CurrentManhuntPage = () => {
    const classes = useReportStyles();

    const [timestamp, setTimestamp] = useState(Date.now());
    const [loading, setLoading] = useState(false);
    const [manhunt, setManhunt] = useState(null);

    useEffectAsync(async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/currentManhunt/get`);
            if (response.ok) {
                setManhunt(await response.json());
            } else {
                throw Error(await response.text());
            }
        } finally {
            setLoading(false);
        }
    }, [timestamp]);

    useEffect(() => {
        if (!manhunt || !manhunt.nextLocationReport)
            return;

        const targetTime = new Date(manhunt.nextLocationReport).getTime();
        const currentTime = new Date().getTime();
        const timeDifference = targetTime - currentTime;

        const interval = setInterval(() => {
            clearInterval(interval);
            setTimestamp(Date.now());
        }, timeDifference);

        return () => clearInterval(interval);

    }, [manhunt?.nextLocationReport]);

    return (
        <PageLayout menu={<ManhuntsMenu />} breadcrumbs={['Manhunt', 'Info']}>
            <Container maxWidth="xs" className={classes.container}>
                {manhunt && (
                    <>
                        <ListItem sx={{
                            backgroundColor: "white",
                            boxShadow: "0px 2px 1px -1px rgba(0, 0, 0, 0), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)"
                        }}>
                            <ListItemIcon>
                                <LocationOnIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Nächste Standortmeldung"
                                secondary={formatTime(manhunt.nextLocationReport, 'minutes')}
                            />
                        </ListItem>
                        <Devices
                            manhunt={manhunt}
                            reload={() => setTimestamp(Date.now())}
                        />
                    </>
                )}
            </Container>
        </PageLayout>
    );
};

export default CurrentManhuntPage;