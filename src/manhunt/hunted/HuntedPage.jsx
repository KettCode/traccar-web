import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import { useEffect, useState, useTransition } from "react";
import { useEffectAsync } from "../../reactHelper";
import Card from "../components/Card";
import LocationItem from "./LocationItem";
import InfoDrawer from "../components/InfoDrawer";
import SpeedHuntItem from "./SpeedHuntItem";
import RotateButton from "../components/RotateButton";
import { useMediaQuery, useTheme } from "@mui/material";
import PageLayout from "../components/PageLayout";

const HuntedPage = () => {
    const theme = useTheme();
    const [timestamp, setTimestamp] = useState(Date.now());
    const [loading, setLoading] = useState(false);
    const [manhuntInfo, setManhuntInfo] = useState({});
    const [showBack, setShowBack] = useState(false);
    const [eventsOpen, setEventsOpen] = useState(false);
    const desktop = useMediaQuery(theme.breakpoints.up('md'));


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

    const cardFront = () => {
        return <>
            <LocationOnIcon className='card-depth-icon' />
            <div class="card-depth">
                <LocationItem
                    manhuntInfo={manhuntInfo}
                    reload={() => setTimestamp(Date.now())}
                />
            </div>
        </>
    }

    const cardBack = () => {
        return <>
            <DirectionsRunIcon className='card-depth-icon' />
            <div class="card-depth">
                <SpeedHuntItem
                    manhuntInfo={manhuntInfo}
                />
            </div>
        </>
    }

    return (
        <PageLayout
            title={"Info"}
            openEvents={() => setEventsOpen(true)}
        >
            {manhuntInfo && (
                <>
                    <InfoDrawer
                        open={eventsOpen}
                        onClose={() => setEventsOpen(false)}
                        manhuntInfo={manhuntInfo}
                        showCatches={true}
                        showSpeedHunts={true}
                    />
                    <Card
                        cardFront={cardFront}
                        cardBack={cardBack}
                        showBack={showBack}
                    />
                    <RotateButton
                        onClick={() => setShowBack(!showBack)}
                    />
                </>
            )}
        </PageLayout>
    );
};

export default HuntedPage;