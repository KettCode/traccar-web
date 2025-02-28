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

const CatchDrawer = ({ 
    open, 
    onClose,
    catches
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
            <Toolbar className={classes.toolbar} disableGutters>
                <Typography variant="h6" className={classes.title}>
                    {"Catches"}
                </Typography>
            </Toolbar>
            <List className={classes.drawer} dense>
                {catches.map((singleCatch) => (
                    <ListItemButton
                        key={singleCatch.id}
                        disabled={true}
                    >
                        <ListItemText
                            primary={`Catch: ${groups[singleCatch.hunterGroupId]?.name} -> ${devices[singleCatch.deviceId]?.name}`}
                            secondary={formatTime(singleCatch.time, 'seconds')}
                        />
                    </ListItemButton>
                ))}
            </List>
        </Drawer>
    );
};

export default CatchDrawer;
