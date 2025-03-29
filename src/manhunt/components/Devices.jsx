import React, { useState } from 'react';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import GpsFixedIcon from '@mui/icons-material//GpsFixed';
import { Button, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { useCatch, useEffectAsync } from '../../reactHelper';
import ConfirmationDialog from './ConfirmationDialog';
import { useTriggerManhuntActions } from '../../common/util/permissions';

const Devices = ({
    manhunt,
    reload
}) => {
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
            <List>
                <div style={{
                    backgroundColor: "white"
                }}>
                    {devices && devices.sort((a, b) => b.manhuntRole - a.manhuntRole).map((device) => (
                        <DeviceItem
                            device={device}
                            onCatch={(device) => {
                                setSelectedDevice(device);
                                setDialogOpen(true);
                            }}
                        />
                    ))}
                </div>
            </List>
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

const DeviceItem = ({
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
        <ListItem style={{
            boxShadow: "0px 2px 1px -1px rgba(0, 0, 0, 0), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)"
        }}>
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
                    <LockIcon sx={{
                        color: "inherit",
                        mr: 1
                    }} />
                    <Typography variant="button" noWrap>Verhaften</Typography>
                </Button>
            )}
        </ListItem>
    </>
}

export default Devices;