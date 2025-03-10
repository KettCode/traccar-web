import React, { useEffect, useState } from 'react';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import LocationItem from '../items/hunter/LocationItem';
import SpeedHuntItem from '../items/hunter/SpeedHuntItem';
import Card from '../components/Card';
import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import ManhuntSelect from '../components/ManhuntSelect';

const SpeedHuntCard = ({
    manhuntInfo,
    reload
}) => {
    const user = useSelector((state) => state.session.user);
    const [showBack, setShowBack] = useState(false);

    useEffect(() => {
        setShowBack(manhuntInfo.isSpeedHuntRunning);
    }, [manhuntInfo.isSpeedHuntRunning])

    const cardFront = () => {
        if (user.group?.manhuntRole == 1)
            return <CardFrontHunter
                manhuntInfo={manhuntInfo}
                reload={reload}
            />

        return <CardFrontHunted />
    }

    const cardBack = () => {
        if (user.group?.manhuntRole == 1) {
            return <CardBackHunter
                manhuntInfo={manhuntInfo}
                reload={reload}
            />
        }

        return <CardBackHunted manhuntInfo={manhuntInfo} />
    };


    return <Card
        cardFront={cardFront}
        cardBack={cardBack}
        showBack={showBack}
    />
}

const CardFrontHunter = ({
    manhuntInfo,
    reload
}) => {
    return <>
        <DirectionsRunIcon className='card-depth-icon' />
        <div class="card-depth">
            <SpeedHuntItem
                speedHuntInfo={manhuntInfo}
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
    manhuntInfo,
    reload
}) => {
    return <>
        <LocationOnIcon className="card-depth-icon" />
        <div className="card-depth">
            <LocationItem
                speedHuntInfo={manhuntInfo}
                onCreated={reload}
                reload={reload}
            />
        </div>
    </>
}

const CardBackHunted = ({
    manhuntInfo
}) => {
    return <>
        <DirectionsRunIcon className='card-depth-icon' />
        <div class="card-depth">
            <Typography variant="h4" sx={{ fontSize: '24px', fontWeight: 'bold', zIndex: 2 }}>
                Speedhunt läuft auf
            </Typography>

            <ManhuntSelect
                endpoint={"/api/currentManhunt/getHuntedDevices"}
                value={manhuntInfo.isSpeedHuntRunning ? manhuntInfo.lastSpeedHunt?.deviceId : null}
                disabled={true}
            />

            <Typography variant="body2" sx={{ fontSize: '14px', zIndex: 2 }}>
                {manhuntInfo.availableSpeedHuntRequests + " Standortanfragen verfügbar"}
            </Typography>
        </div>
    </>
}

export default SpeedHuntCard;