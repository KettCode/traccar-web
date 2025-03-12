import React, { useEffect, useState } from 'react';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import LocationItem from './LocationItem';
import SpeedHuntItem from './SpeedHuntItem';
import Card from './Card';
import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import ManhuntSelect from './ManhuntSelect';

const SpeedHuntCard = ({
    speedHuntInfo,
    reload
}) => {
    const user = useSelector((state) => state.session.user);
    const [showBack, setShowBack] = useState(false);

    useEffect(() => {
        setShowBack(speedHuntInfo.isSpeedHuntRunning);
    }, [speedHuntInfo.isSpeedHuntRunning])

    const cardFront = () => {
        if (user.group?.manhuntRole == 1)
            return <CardFrontHunter
                speedHuntInfo={speedHuntInfo}
                reload={reload}
            />

        return <CardFrontHunted />
    }

    const cardBack = () => {
        if (user.group?.manhuntRole == 1) {
            return <CardBackHunter
                speedHuntInfo={speedHuntInfo}
                reload={reload}
            />
        }

        return <CardBackHunted speedHuntInfo={speedHuntInfo} />
    };


    return <Card
        cardFront={cardFront}
        cardBack={cardBack}
        showBack={showBack}
    />
}

const CardFrontHunter = ({
    speedHuntInfo,
    reload
}) => {
    return <>
        <DirectionsRunIcon className='card-depth-icon' />
        <div class="card-depth">
            <SpeedHuntItem
                speedHuntInfo={speedHuntInfo}
                onCreated={reload}
                reload={reload} />

        </div>
    </>
}

const CardFrontHunted = () => {
    return <>
        <DirectionsRunIcon className='card-depth-icon' />
        <div class="card-depth">
            <Typography variant="h4" sx={{ fontSize: '24px', fontWeight: 'bold', zIndex: 2 }}>
                Aktuell läuft kein Speedhunt
            </Typography>
        </div>
    </>
}

const CardBackHunter = ({
    speedHuntInfo,
    reload
}) => {
    return <>
        <LocationOnIcon className="card-depth-icon" />
        <div className="card-depth">
            <LocationItem
                speedHuntInfo={speedHuntInfo}
                onCreated={reload}
                reload={reload}
            />
        </div>
    </>
}

const CardBackHunted = ({
    speedHuntInfo
}) => {
    return <>
        <DirectionsRunIcon className='card-depth-icon' />
        <div class="card-depth">
            <Typography variant="h4" sx={{ fontSize: '24px', fontWeight: 'bold', zIndex: 2 }}>
                Speedhunt läuft auf
            </Typography>

            <ManhuntSelect
                endpoint={"/api/currentManhunt/getHuntedDevices"}
                value={speedHuntInfo.isSpeedHuntRunning ? speedHuntInfo.lastSpeedHunt?.deviceId : null}
                disabled={true}
            />

            <Typography variant="body2" sx={{ fontSize: '14px', zIndex: 2 }}>
                {speedHuntInfo.availableSpeedHuntRequests + " Standortanfragen verfügbar"}
            </Typography>
        </div>
    </>
}

export default SpeedHuntCard;