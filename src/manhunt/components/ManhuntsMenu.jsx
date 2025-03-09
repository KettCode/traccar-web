import React from 'react';
import { List } from '@mui/material';
import { useLocation } from 'react-router-dom';
import MenuItem from '../../common/components/MenuItem';
import { useSelector } from 'react-redux';
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import HttpsIcon from "@mui/icons-material/Https";
import InfoIcon from '@mui/icons-material/Info';

const ManhuntsMenu = () => {
    const location = useLocation();
    const user = useSelector((state) => state.session.user);

    return (
        <>
            <List>
                {user.group && user.group.manhuntRole == 2 && <MenuItem
                    title={"Quickinfo"}
                    link="/manhunt/quickInfo"
                    icon={<InfoIcon />}
                    selected={location.pathname === '/manhunt/quickInfo'}
                />}
                {<MenuItem
                    title={"Speedhunts"}
                    link="/manhunt/speedHunts"
                    icon={<DirectionsRunIcon />}
                    selected={location.pathname === '/manhunt/speedHunts'}
                />}
                {<MenuItem
                    title={"Verhaftungen"}
                    link="/manhunt/catches"
                    icon={<HttpsIcon />}
                    selected={location.pathname === '/manhunt/catches'}
                />}
            </List>
        </>
    );
};

export default ManhuntsMenu;
