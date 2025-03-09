import React, { useEffect, useState } from 'react';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import LocationItem from '../items/hunter/LocationItem';
import SpeedHuntItem from '../items/hunter/SpeedHuntItem';
import Card from '../components/Card';

const HunterSpeedHuntCard = ({
    manhuntInfo,
    reload
}) => {
    const [showBack, setShowBack] = useState(false);

    useEffect(() => {
        setShowBack(manhuntInfo.isSpeedHuntRunning);
    }, [manhuntInfo.isSpeedHuntRunning])

    const cardFront = () => {
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

    const cardBack = () => {
        return <>
            <LocationOnIcon className='card-depth-icon' />
            <div class="card-depth">
                <LocationItem
                    speedHuntInfo={manhuntInfo}
                    onCreated={reload}
                    reload={reload} />
            </div>
        </>
    }


    return <Card
        cardFront={cardFront}
        cardBack={cardBack}
        showBack={showBack}
    />
}

export default HunterSpeedHuntCard;