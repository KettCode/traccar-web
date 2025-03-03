import LocationOnIcon from "@mui/icons-material/LocationOn";
import HttpsIcon from "@mui/icons-material/Https";
import { useEffect, useState, useTransition } from "react";
import useSettingsStyles from "../../settings/common/useSettingsStyles";
import { useNavigate, useParams } from "react-router-dom";
import { useCatch, useEffectAsync } from "../../reactHelper";
import PageLayout from "../../common/components/PageLayout";
import DrawerButton from "../DrawerButton";
import Card from "../Card";
import LocationItem from "./LocationItem";
import HuntedInfoDrawer from "./HuntedInfoDrawer";

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
    const [huntedDevices, setHuntedDevices] = useState([]);

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

      useEffectAsync(async () => {
        const response = await fetch('/api/currentManhunt/getHuntedDevices');
        if (response.ok) {
          setHuntedDevices(await response.json());
        } else {
          throw Error(await response.text());
        }
      }, [timestamp]);

    useEffect(() => {
        setShowBack(manhuntInfo.isHunted);
    }, [manhuntInfo.isHunted])

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
            <HttpsIcon className='card-depth-icon' />
            <div class="card-depth">
                {/* <LocationItem
                    speedHuntInfo={manhuntInfo}
                    onCreated={onCreated}
                    reload={() => setTimestamp(Date.now())} /> */}
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
                        <HuntedInfoDrawer 
                            open={eventsOpen}
                            onClose={() => setEventsOpen(false)}
                            manhuntInfo={manhuntInfo}
                            huntedDevices={huntedDevices}
                        />
                        <Card
                            cardFront={cardFront}
                            cardBack={cardBack}
                            showBack={showBack}
                        />
                    </>
                )}
            </div>
        </PageLayout>
    );
};

export default HuntedInfo;