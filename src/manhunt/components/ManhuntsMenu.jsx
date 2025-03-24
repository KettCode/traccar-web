import React from 'react';
import { List } from '@mui/material';
import { useLocation } from 'react-router-dom';
import MenuItem from '../../common/components/MenuItem';
import { useSelector } from 'react-redux';
import GroupsIcon from '@mui/icons-material/Groups';
import TimelineIcon from '@mui/icons-material/Timeline';
import { useTranslation } from '../../common/components/LocalizationProvider';

const ManhuntsMenu = () => {
    const location = useLocation();
    const t = useTranslation();
    const user = useSelector((state) => state.session.user);

    return (
        <>
            <List>
                {<MenuItem
                    title={"Allgemein"}
                    link="/manhunt/current"
                    icon={<GroupsIcon />}
                    selected={location.pathname === '/manhunt/current'}
                />}
                {/* <MenuItem
                    title={t('reportRoute')}
                    link="/reports/route"
                    icon={<TimelineIcon />}
                    selected={location.pathname === '/reports/route'}
                /> */}
            </List>
        </>
    );
};

export default ManhuntsMenu;
