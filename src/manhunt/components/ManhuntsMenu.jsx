import React from 'react';
import { List } from '@mui/material';
import { useLocation } from 'react-router-dom';
import MenuItem from '../../common/components/MenuItem';
import { useSelector } from 'react-redux';
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';

const ManhuntsMenu = () => {
    const location = useLocation();
    const user = useSelector((state) => state.session.user);

    return (
        <>
            <List>
                {<MenuItem
                    title={"Speedhunts"}
                    link="/manhunt/speedHunts"
                    icon={<DirectionsRunIcon />}
                    selected={location.pathname === '/manhunt/speedHunts'}
                />}
                {<MenuItem
                    title={"Info"}
                    link="/manhunt/info"
                    icon={<PersonPinCircleIcon />}
                    selected={location.pathname === '/manhunt/info'}
                />}
            </List>
        </>
    );
};

export default ManhuntsMenu;
