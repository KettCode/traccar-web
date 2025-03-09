import React from 'react';
import { Divider, List } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import TimelineIcon from '@mui/icons-material/Timeline';
import { useLocation } from 'react-router-dom';
import MenuItem from '../../common/components/MenuItem';
import { useSelector } from 'react-redux';
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import HttpsIcon from "@mui/icons-material/Https";
import InfoIcon from '@mui/icons-material/Info';
import RunCircleIcon from '@mui/icons-material/RunCircle';
import GavelIcon from '@mui/icons-material/Gavel';

const ManhuntsMenu = () => {
    const location = useLocation();
    const user = useSelector((state) => state.session.user);

    return (
        <>
            <List>
                {user.group && user.group.manhuntRole == 1 && <MenuItem
                    title={"Speedhunt"}
                    link="/manhunt/speedHunt"
                    icon={<DirectionsRunIcon />}
                    selected={location.pathname === '/manhunt/speedHunt'}
                />}
                {user.group && user.group.manhuntRole == 1 && <MenuItem
                    title={"Verhaften"}
                    link="/manhunt/catch"
                    icon={<HttpsIcon />}
                    selected={location.pathname === '/manhunt/catch'}
                />}
                {user.group && user.group.manhuntRole == 2 && <MenuItem
                    title={"Info"}
                    link="/manhunt/huntedInfo"
                    icon={<InfoIcon />}
                    selected={location.pathname === '/manhunt/huntedInfo'}
                />}
                <Divider />
                <MenuItem
                    title={"Speedhunts (Info)"}
                    link="/manhunt/speedHuntsInfo"
                    icon={<RunCircleIcon />}
                    selected={location.pathname === '/manhunt/speedHuntsInfo'}
                />
                <MenuItem
                    title={"Verhaftungen (Info)"}
                    link="/manhunt/catchInfo"
                    icon={<GavelIcon />}
                    selected={location.pathname === '/manhunt/catchInfo'}
                />
            </List>
        </>
    );
};

export default ManhuntsMenu;
