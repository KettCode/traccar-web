import React from 'react';
import {
    Drawer, List, ListItemButton, ListItemText, Toolbar, Typography,
} from '@mui/material';
import { formatTime } from '../../common/util/formatter';
import { makeStyles } from '@mui/styles';

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

const InfoDrawer = ({
    open,
    onClose,
    manhuntInfo,
    showCatches,
    showSpeedHunts
}) => {
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
        >
            {showCatches && manhuntInfo.catches && (
                <Catches manhuntInfo={manhuntInfo} />
            )}
            {showSpeedHunts && manhuntInfo.speedHunts && (
                <SpeedHunts manhuntInfo={manhuntInfo} />
            )}
        </Drawer>
    );
};

const Catches = ({
    manhuntInfo
}) => {
    const classes = useStyles();

    return <>
        <Toolbar className={classes.toolbar} disableGutters>
            <Typography variant="h6" className={classes.title}>
                {"Verhaftungen"}
            </Typography>
        </Toolbar>
        <List className={classes.drawer} dense>
            {manhuntInfo.catches && manhuntInfo.catches.map((singleCatch) => (
                <ListItemButton
                    key={singleCatch.id}
                    disabled={true}
                >
                    <ListItemText
                        primary={`Verhaftung von ${manhuntInfo.devices.find(x => x.id == singleCatch.deviceId)?.name} um`}
                        secondary={formatTime(singleCatch.time, 'minutes')}
                    />
                </ListItemButton>
            ))}
        </List>
        <Toolbar className={classes.toolbar} disableGutters>
            <Typography variant="h6" className={classes.title}>
                {"Auf der Flucht"}
            </Typography>
        </Toolbar>
        <List className={classes.drawer} dense>
            {manhuntInfo.huntedDevices && manhuntInfo.huntedDevices.map((huntedDevice) => (
                <ListItemButton
                    key={huntedDevice.id}
                    disabled={true}
                >
                    <ListItemText
                        primary={`${manhuntInfo.devices.find(x => x.id == huntedDevice.id)?.name}`}
                    />
                </ListItemButton>
            ))}
        </List>
    </>
}

const SpeedHunts = ({
    manhuntInfo
}) => {
    const classes = useStyles();

    return <>
        <Toolbar className={classes.toolbar} disableGutters>
            <Typography variant="h6" className={classes.title}>
                {"Speedhunts"}
            </Typography>
        </Toolbar>
        <List className={classes.drawer} dense>
            {manhuntInfo.speedHunts && manhuntInfo.speedHunts.map((speedHunt) => (
                <>
                    <ListItemButton
                        key={speedHunt.id}
                        disabled={true}
                    >
                        <ListItemText
                            primary={`Speedhunt auf ${manhuntInfo.devices.find(x => x.id == speedHunt.deviceId)?.name}`}
                        />
                    </ListItemButton>
                    <div style={{ marginLeft: "30px" }}>
                        {speedHunt.speedHuntRequests && speedHunt.speedHuntRequests.map((speedHuntRequests) => (
                            <ListItemButton
                                key={speedHuntRequests.id}
                                disabled={true}
                            >
                                <ListItemText
                                    primary={`Standortanfrage um`}
                                    secondary={formatTime(speedHuntRequests.time, 'minutes')}
                                />
                            </ListItemButton>
                        ))}
                    </div>
                </>
            ))}
        </List>
    </>
}

export default InfoDrawer;
