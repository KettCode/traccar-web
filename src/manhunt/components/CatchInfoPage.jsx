import { useState } from "react";
import { useEffectAsync } from "../../reactHelper";
import { Typography } from "@mui/material";
import PageLayout from "../../common/components/PageLayout";
import useReportStyles from "../../reports/common/useReportStyles";
import ManhuntsMenu from "../components/ManhuntsMenu";
import Card from "./Card";
import RotateButton from "./RotateButton";
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { formatTime } from "../../common/util/formatter";

const CatchInfoPage = () => {
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

    const cardFront = () => {
        return <>
            <LockIcon className='card-depth-icon' />
            <div class="card-depth">
                {manhuntInfo.catches && manhuntInfo.catches.map((singleCatch) => (
                    <Typography>
                        {`${manhuntInfo.devices.find(x => x.id == singleCatch.deviceId)?.name}`}
                    </Typography>
                ))}
                {manhuntInfo.catches && manhuntInfo.catches.length == 0 &&
                    <Typography>
                        Es gibt noch keine Verhaftungen
                    </Typography>
                }
            </div>
        </>
    }

    const cardBack = () => {
        return <>
            <LockOpenIcon className='card-depth-icon' />
            <div class="card-depth">
                {manhuntInfo.huntedDevices && manhuntInfo.huntedDevices.map((huntedDevice) => (
                    <>
                        <Typography variant="subtitle1">
                            {`${manhuntInfo.devices.find(x => x.id == huntedDevice.id)?.name}`}
                        </Typography>
                    </>
                ))}
                {manhuntInfo.huntedDevices && manhuntInfo.huntedDevices.length == 0 &&
                    <Typography>
                        Alle Spieler wurden verhaftet
                    </Typography>
                }
            </div>
        </>
    }

    return (
        <PageLayout menu={<ManhuntsMenu />} breadcrumbs={['Manhunt', 'Verhaftungen (Info)']}>
            <div className={classes.container} style={{
                position: "relative",
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                {manhuntInfo && (
                    <>
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
        </PageLayout >
    );
};

export default CatchInfoPage;