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
        setShowBack(speedHuntInfo.lastSpeedHunt?.isSpeedHuntRunning);
    }, [speedHuntInfo.lastSpeedHunt?.isSpeedHuntRunning])

    const cardFront = () => {
        return <>
            <DirectionsRunIcon className='card-depth-icon' />
            <div class="card-depth">
                {
                    user.group?.manhuntRole == 1
                        ?
                        <SpeedHuntItem
                            speedHuntInfo={speedHuntInfo}
                            onCreated={reload}
                            reload={reload} />
                        :
                        <Typography variant="h4" sx={{ fontSize: '24px', fontWeight: 'bold', zIndex: 2 }}>
                            Aktuell läuft kein Speedhunt
                        </Typography>
                }

            </div>
        </>
    }

    const cardBack = () => {
        return <>
            <LocationOnIcon className="card-depth-icon" />
            <div className="card-depth">
                {
                    user.group?.manhuntRole == 1
                        ?
                        <LocationItem
                            speedHuntInfo={speedHuntInfo}
                            onCreated={reload}
                            reload={reload}
                        />
                        : <>
                            <Typography variant="h4" sx={{ fontSize: '24px', fontWeight: 'bold', zIndex: 2 }}>
                                Speedhunt läuft auf
                            </Typography>

                            <ManhuntSelect
                                endpoint={"/api/currentManhunt/getHuntedDevices"}
                                value={speedHuntInfo.lastSpeedHunt?.isSpeedHuntRunning ? speedHuntInfo.lastSpeedHunt?.deviceId : null}
                                disabled={true}
                            />

                            <Typography variant="body2" sx={{ fontSize: '14px', zIndex: 2 }}>
                                {speedHuntInfo.lastSpeedHunt?.availableSpeedHuntRequests + " Standortanfragen verfügbar"}
                            </Typography>
                        </>
                }
            </div>
        </>
    };


    return <Card
        cardFront={cardFront}
        cardBack={cardBack}
        showBack={showBack}
    />
}

export default SpeedHuntCard;