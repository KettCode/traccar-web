import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useEffect, useState } from "react";
import { useCatch, useEffectAsync } from "../reactHelper";
import Card from "./components/Card";
import PageLayout from "../common/components/PageLayout";
import useReportStyles from "../reports/common/useReportStyles";
import ManhuntsMenu from "./components/ManhuntsMenu";
import { Container, Typography } from "@mui/material";
import { formatTime } from "../common/util/formatter";
import DevicesInfo from "./components/DevicesInfo";
import { useSelector } from "react-redux";

const ManhuntInfoPage = () => {
    const classes = useReportStyles();

    const user = useSelector((state) => state.session.user);

    const [timestamp, setTimestamp] = useState(Date.now());
    const [loading, setLoading] = useState(false);
    const [manhuntInfo, setManhuntInfo] = useState({});
    const [showBack, setShowBack] = useState(false);

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
        return <></>
    }

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
                        </Container>
                        <Container maxWidth="xs" className={classes.container} style={{
                            height: "50%",
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