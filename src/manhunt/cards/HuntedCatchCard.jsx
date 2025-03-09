import React, { useState } from 'react';
import Card from '../components/Card';
import LockIcon from '@mui/icons-material/Lock';

const HuntedCatchCard = ({
    manhuntInfo
}) => {
    const [showBack, setShowBack] = useState(false);

    const cardFront = () => {
        return <>
            <LockIcon className='card-depth-icon' />
            <div class="card-depth">
            </div>
        </>
    }

    const cardBack = () => {
        return <></>
    }


    return <Card
        cardFront={cardFront}
        cardBack={cardBack}
        showBack={showBack}
    />
}

export default HuntedCatchCard;