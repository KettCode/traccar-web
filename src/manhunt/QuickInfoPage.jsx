import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import { useEffect, useState } from "react";
import { useEffectAsync } from "../reactHelper";
import Card from "./components/Card";
import RotateButton from "./components/RotateButton";
import PageLayout from "../common/components/PageLayout";
import useReportStyles from "../reports/common/useReportStyles";
import ManhuntsMenu from "./components/ManhuntsMenu";
import { Container, Typography } from "@mui/material";
import ManhuntSelect from "./components/ManhuntSelect";
import { formatTime } from "../common/util/formatter";

const QuickInfoPage = () => {
    const [timestamp, setTimestamp] = useState(Date.now());
    const [loading, setLoading] = useState(false);
    const [manhuntInfo, setManhuntInfo] = useState({});
    const [showBack, setShowBack] = useState(false);
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

    useEffect(() => {
        setShowBack(manhuntInfo.isSpeedHuntRunning);
    }, [manhuntInfo.isSpeedHuntRunning])

    useEffect(() => {
        if (!manhuntInfo || !manhuntInfo.nextPosition)
            return;

        const targetTime = new Date(manhuntInfo.nextPosition).getTime();
        const interval = setInterval(() => {
            const currentTime = new Date().getTime();

            if (currentTime >= targetTime) {
                reload();
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);

    }, [manhuntInfo.nextPosition]);

    const cardFront = () => {
        return <>
            <LocationOnIcon className='card-depth-icon' />
            <div class="card-depth">
                <Typography variant="h4" sx={{ fontSize: '20px', zIndex: 2 }}>
                    Nächste Standortmeldung
                </Typography>

                <Typography variant="h4" sx={{ fontSize: '18px', fontWeight: 'bold', zIndex: 2 }}>
                    {formatTime(manhuntInfo.nextPosition, 'minutes')}
                </Typography>
            </div>
        </>
    }

    const cardBack = () => {
        return <>
            <DirectionsRunIcon className='card-depth-icon' />
            <div class="card-depth">
                <Typography variant="h4" sx={{ fontSize: '24px', fontWeight: 'bold', zIndex: 2 }}>
                    Speedhunt läuft auf
                </Typography>

                <ManhuntSelect
                    endpoint={"/api/currentManhunt/getHuntedDevices"}
                    value={manhuntInfo.isSpeedHuntRunning ? manhuntInfo.lastSpeedHunt?.deviceId : null}
                    onChange={(event) => setItem({ ...item, deviceId: Number(event.target.value) })}
                    disabled={true}
                />

                <Typography variant="body2" sx={{ fontSize: '14px', zIndex: 2 }}>
                    {manhuntInfo.availableSpeedHuntRequests + " Standortanfragen verfügbar"}
                </Typography>
            </div>
        </>
    }

    return (
        <PageLayout menu={<ManhuntsMenu />} breadcrumbs={['Manhunt', 'Quickinfo']}>
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
                            position: "relative",
                            height: "50%",
                            padding: "0px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <Card
                                cardFront={cardFront}
                                cardBack={cardBack}
                                showBack={showBack}
                            />
                            <RotateButton
                                onClick={() => setShowBack(!showBack)}
                            />
                        </Container>
                    </>
                )}
            </div>
        </PageLayout>
    );
};

export default QuickInfoPage;