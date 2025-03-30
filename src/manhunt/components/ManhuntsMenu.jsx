import React from 'react';
import { List } from '@mui/material';
import { useLocation } from 'react-router-dom';
import MenuItem from '../../common/components/MenuItem';
import { useSelector } from 'react-redux';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

const ManhuntsMenu = () => {
    const location = useLocation();
    const user = useSelector((state) => state.session.user);

    return (
        <>
            <List>
                {<MenuItem
                    title={"Allgemein"}
                    link="/manhunt/current"
                    icon={<PersonSearchIcon />}
                    selected={location.pathname === '/manhunt/current'}
                />}
                {/* {<MenuItem
                    title={"Speedhunts"}
                    link="/manhunt/speedHunts"
                    icon={<DirectionsRunIcon />}
                    selected={location.pathname === '/manhunt/speedHunts'}
                />} */}
            </List>
        </>
    );
};

export default ManhuntsMenu;
