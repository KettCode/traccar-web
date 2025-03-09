import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import { Typography } from '@mui/material';
import ManhuntSelect from '../components/ManhuntSelect';

const HuntedSpeedHuntCard = ({
    manhuntInfo
}) => {
    const [showBack, setShowBack] = useState(false);

    useEffect(() => {
        setShowBack(manhuntInfo.isSpeedHuntRunning);
    }, [manhuntInfo.isSpeedHuntRunning])

    const cardFront = () => {
        return <>
            <DirectionsRunIcon className='card-depth-icon' />
            <div class="card-depth">
            <Typography variant="h4" sx={{ fontSize: '24px', fontWeight: 'bold', zIndex: 2 }}>
                    Aktuell läuft kein Speedhunt
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


    return <Card
        cardFront={cardFront}
        cardBack={cardBack}
        showBack={showBack}
    />
}

export default HuntedSpeedHuntCard;