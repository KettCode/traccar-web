import React, { useEffect, useState } from 'react';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import LocationItem from './LocationItem';
import SpeedHuntItem from './SpeedHuntItem';
import Card from './Card';

const SpeedHuntCard = ({
    speedHuntInfo,
    reload
}) => {
    const [showBack, setShowBack] = useState(false);

    useEffect(() => {
        setShowBack(speedHuntInfo.lastSpeedHunt?.isSpeedHuntRunning);
    }, [speedHuntInfo.lastSpeedHunt?.isSpeedHuntRunning])

    const cardFront = () => {
        return <>
            <DirectionsRunIcon className='card-depth-icon' />
            <div class="card-depth">
                <SpeedHuntItem
                    speedHuntInfo={speedHuntInfo}
                    reload={reload} />
            </div>
        </>
    }

    const cardBack = () => {
        return <>
            <LocationOnIcon className="card-depth-icon" />
            <div className="card-depth">
                <LocationItem
                    speedHunt={speedHuntInfo.lastSpeedHunt}
                    reload={reload}
                />
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