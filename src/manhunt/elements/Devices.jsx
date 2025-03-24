import React, { useState } from 'react';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import GpsFixedIcon from '@mui/icons-material//GpsFixed';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { useCatch, useEffectAsync } from '../../reactHelper';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { useTriggerManhuntActions } from '../../common/util/permissions';
import useReportStyles from '../../reports/common/useReportStyles';

const Devices = ({
    manhunt,
    reload
}) => {
    const classes = useReportStyles();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [devices, setDevices] = useState(null);

    useEffectAsync(async () => {
        const response = await fetch(`/api/currentManhunt/getDevices?manhuntId=${manhunt.id}`);
        if (response.ok) {
            setDevices(await response.json());
        } else {
            throw Error(await response.text());
        }
    }, [manhunt]);

    const createCatch = useCatch(async (device) => {
        let url = `/api/currentManhunt/createCatch?manhuntId=${manhunt.id}&deviceId=${device.id}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            reload();
        } else {
            reload();
            throw Error(await response.text());
        }
    });

    return <>
        {devices && (
            <>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box display="flex" alignItems="center">
                            <PersonSearchIcon sx={{ mr: 1 }} />
                            <Typography variant="subtitle1">
                                {`Gejagte`}
                            </Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails className={classes.details}>
                        <List>
                            {devices.filter((x) => x.manhuntRole == 2).map((device) =>
                                <DeviceListItem
                                    device={device}
                                    onCatch={(device) => {
                                        setSelectedDevice(device);
                                        setDialogOpen(true);
                                    }}
                                />
                            )}
                        </List>
                    </AccordionDetails>
                </Accordion >
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box display="flex" alignItems="center">
                            <GpsFixedIcon sx={{ mr: 1 }} />
                            <Typography variant="subtitle1">
                                {`Jäger`}
                            </Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails className={classes.details}>
                        <List>
                            {devices.filter((x) => x.manhuntRole == 1).map((device) =>
                                <DeviceListItem
                                    device={device}
                                    onCatch={(device) => {
                                        setSelectedDevice(device);
                                        setDialogOpen(true);
                                    }}
                                />
                            )}
                        </List>
                    </AccordionDetails>
                </Accordion >
            </>
        )}
        <ConfirmationDialog
            open={dialogOpen}
            onClose={() => {
                setDialogOpen(false);
            }}
            onConfirm={() => {
                setDialogOpen(false);
                createCatch(selectedDevice);
            }}
            title="Verhaften"
            message="Spieler wirklich verhaften?"
        />
    </>
}

const DeviceListItem = ({
    device,
    onCatch
}) => {
    const triggerManhuntActions = useTriggerManhuntActions();

    var color = "grey";
    var text = "Jäger";
    var Icon = GpsFixedIcon;
    if (device.manhuntRole == 2) {
        text = device.isCaught ? "Verhafted" : "Frei";
        color = device.isCaught ? "#EF5350" : "#66BB6A";
        Icon = device.isCaught ? LockIcon : LockOpenIcon;
    }

    return <>
        <ListItem>
            <ListItemIcon>
                <Icon sx={{ color: color }} />
            </ListItemIcon>
            <ListItemText
                primary={`${device.name}`}
                secondary={text}
                secondaryTypographyProps={{ color: color }}
            />
            {triggerManhuntActions && device.manhuntRole == 2 && !device.isCaught && (
                <Button
                    size="small"
                    text="Verhaften"
                    variant="outlined"
                    onClick={() => onCatch(device)}
                    sx={{
                        color: "#EF5350",
                        borderColor: "#EF5350",
                        borderRadius: '20px',
                        padding: '6px 16px',
                        fontWeight: 'bold',
                        '&:hover': {
                            backgroundColor: "#C62828",
                            borderColor: "#C62828"
                        }
                    }}
                >
                    <LockIcon sx={{ color: "inherit" }} />
                    <Typography variant="button" noWrap>Verhaften</Typography>
                </Button>
            )}
        </ListItem>
    </>
}

export default Devices;