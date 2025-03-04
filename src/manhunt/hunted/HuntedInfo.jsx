import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import { useEffect, useState, useTransition } from "react";
import useSettingsStyles from "../../settings/common/useSettingsStyles";
import { useNavigate, useParams } from "react-router-dom";
import { useCatch, useEffectAsync } from "../../reactHelper";
import PageLayout from "../../common/components/PageLayout";
import DrawerButton from "../components/DrawerButton";
import Card from "../components/Card";
import LocationItem from "./LocationItem";
import InfoDrawer from "../components/InfoDrawer";
import SpeedHuntItem from "./SpeedHuntItem";
import RotateButton from "../components/RotateButton";

const HuntedInfo = () => {
    const classes = useSettingsStyles();
    const t = useTransition();
    const navigate = useNavigate();
    const { id } = useParams();

    const [timestamp, setTimestamp] = useState(Date.now());
    const [loading, setLoading] = useState(false);
    const [manhuntInfo, setManhuntInfo] = useState({});
    const [showBack, setShowBack] = useState(false);
    const [eventsOpen, setEventsOpen] = useState(false);

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
        <PageLayout menu={<></>} breadcrumbs={['', '']}>
            <div maxWidth="xs" className={classes.container}
                style={{
                    position: "relative",
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                {manhuntInfo && (
                    <>
                        <DrawerButton
                            title={"Übersicht"}
                            onClick={() => setEventsOpen(true)}
                        />
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
            </div>
        </PageLayout>
    );
};

export default HuntedInfo;