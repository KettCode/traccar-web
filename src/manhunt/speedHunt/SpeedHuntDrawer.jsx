import React from 'react';
import { useSelector } from 'react-redux';
import {
    Drawer, List, ListItemButton, ListItemText, Toolbar, Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { formatTime } from '../../common/util/formatter';


const useStyles = makeStyles((theme) => ({
    drawer: {
        width: theme.dimensions.eventsDrawerWidth,
    },
    toolbar: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

const SpeedHuntDrawer = ({
    open,
    onClose,
    speedHuntInfo
}) => {
    const classes = useStyles();

    const devices = useSelector((state) => state.devices.items);
    const groups = useSelector((state) => state.groups.items);

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
        >
            {speedHuntInfo.speedHunts && (
                <>
                    <Toolbar className={classes.toolbar} disableGutters>
                        <Typography variant="h6" className={classes.title}>
                            {"Speedhunts"}
                        </Typography>
                    </Toolbar>
                    <List className={classes.drawer} dense>
                        {speedHuntInfo.speedHunts.map((speedHunt) => (
                            <>
                                <ListItemButton
                                    key={speedHunt.id}
                                    disabled={true}
                                >
                                    <ListItemText
                                        primary={`Speedhunt: ${groups[speedHunt.hunterGroupId]?.name} -> ${devices[speedHunt.deviceId]?.name}`}
                                        secondary={formatTime(speedHunt.lastTime, 'seconds')}
                                    />
                                </ListItemButton>
                                <div style={{marginLeft: "30px"}}>
                                    {speedHunt.speedHuntRequests.map((speedHuntRequests) => (
                                        <ListItemButton
                                            key={speedHuntRequests.id}
                                            disabled={true}
                                        >
                                            <ListItemText
                                                primary={`Standort: ${devices[speedHunt.deviceId]?.name}`}
                                                secondary={formatTime(speedHuntRequests.time, 'seconds')}
                                            />
                                        </ListItemButton>
                                    ))}
                                </div>
                            </>
                        ))}
                    </List>
                </>)}
        </Drawer>
    );
};

export default SpeedHuntDrawer;
