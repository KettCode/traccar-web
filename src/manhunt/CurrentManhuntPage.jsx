import { useEffect, useState } from "react";
import { useEffectAsync } from "../reactHelper";
import PageLayout from "../common/components/PageLayout";
import useReportStyles from "../reports/common/useReportStyles";
import ManhuntsMenu from "./components/ManhuntsMenu";
import { Container } from "@mui/material";
import { useSelector } from "react-redux";
import Location from "./elements/Location";
import SpeedHunt from "./elements/SpeedHunt";
import Devices from "./elements/Devices";
import SpeedHunts from "./elements/SpeedHunts";

const CurrentManhuntPage = () => {
    const classes = useReportStyles();
    const user = useSelector((state) => state.session.user);

    const [timestamp, setTimestamp] = useState(Date.now());
    const [loading, setLoading] = useState(false);
    const [manhunt, setManhunt] = useState(null);

    useEffectAsync(async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/currentManhunt/get?loadCascade=true`);
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
        <PageLayout menu={<ManhuntsMenu />} breadcrumbs={['Manhunt', 'Allgemein']}>
            <Container maxWidth="xs" className={classes.container}>
                {manhunt && (
                    <>
                        <Location 
                            manhunt={manhunt}
                        />
                        <SpeedHunt
                            manhunt={manhunt}
                            reload={() => setTimestamp(Date.now())}
                        />
                        <Devices
                            manhunt={manhunt}
                            reload={() => setTimestamp(Date.now())}
                        />
                        {user.manhuntRole == 1 && (
                            <SpeedHunts
                                manhunt={manhunt}
                            />
                        )}
                    </>
                )}
            </Container>
        </PageLayout>
    );
};

export default CurrentManhuntPage;