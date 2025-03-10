import React, { useState } from 'react';
import Card from '../components/Card';
import LockIcon from '@mui/icons-material/Lock';
import CatchItem from '../items/hunter/CatchItem';
import { useSelector } from 'react-redux';

const CatchCard = ({
    reload
}) => {
    const user = useSelector((state) => state.session.user);
    const [showBack, setShowBack] = useState(false);

    const cardFront = () => {
        return <>
            <LockIcon className='card-depth-icon' />
            <div class="card-depth">
                {user.group?.manhuntRole == 1 && (
                    <CatchItem
                        onCreated={reload}
                        reload={reload}
                    />
                )}
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

export default CatchCard;