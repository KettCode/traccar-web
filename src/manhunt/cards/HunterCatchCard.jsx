import React, { useState } from 'react';
import Card from '../components/Card';
import LockIcon from '@mui/icons-material/Lock';
import CatchItem from '../items/hunter/CatchItem';

const HunterCatchCard = ({
    reload
}) => {
    const [showBack, setShowBack] = useState(false);

    const cardFront = () => {
        return <>
            <LockIcon className='card-depth-icon' />
            <div class="card-depth">
                <CatchItem
                    onCreated={reload}
                    reload={reload}
                />
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

export default HunterCatchCard;