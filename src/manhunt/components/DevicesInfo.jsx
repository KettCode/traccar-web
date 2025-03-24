import React, { useState } from 'react';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useSelector } from 'react-redux';
import { useCatch } from '../../reactHelper';
import ConfirmationDialog from './ConfirmationDialog';

const DevicesInfo = ({
    manhuntInfo,
    reload
}) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [huntedDevice, setHuntedDevice] = useState(null);

    const createCatch = useCatch(async (device) => {
        let url = `/api/currentManhunt/createCatch?deviceId=${device.id}`;

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
        <List>
            <div style={{
                backgroundColor: "white"
            }}>
                {manhuntInfo.huntedDevices && manhuntInfo.huntedDevices.map((huntedDevice) => (
                    <HuntedItem
                        huntedDevice={huntedDevice}
                        onCatch={(device) => {
                            setHuntedDevice(device);
                            setDialogOpen(true);
                        }}
                    />
                ))}
            </div>
        </List>
        <ConfirmationDialog
            open={dialogOpen}
            onClose={() => {
                setDialogOpen(false);
            }}
            onConfirm={() => {
                setDialogOpen(false);
                createCatch(huntedDevice);
            }}
            title="Verhaften"
            message="Spieler wirklich verhaften?"
        />
    </>
}

const HuntedItem = ({
    huntedDevice,
    onCatch
}) => {
    const user = useSelector((state) => state.session.user);

    var color = huntedDevice.isCaught ? "#EF5350" : "#66BB6A";
    var text = huntedDevice.isCaught ? "Verhafted" : "Frei";

    return <>
        <ListItem style={{
            boxShadow: "0px 2px 1px -1px rgba(0, 0, 0, 0), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)"
        }}>
            <ListItemIcon>
                {huntedDevice.isCaught ?
                    <LockIcon sx={{
                        color: color
                    }} /> :
                    <LockOpenIcon sx={{
                        color: color
                    }} />
                }
            </ListItemIcon>
            <ListItemText
                primary={`${huntedDevice.name}`}
                secondary={text}
                secondaryTypographyProps={{ color: color }}
            />
            {user.manhuntRole == 1 && !huntedDevice.isCaught && (
                <Button
                    variant="contained"
                    onClick={() => onCatch(huntedDevice)}
                    sx={{
                        ml: 2,
                        backgroundColor: "#90A4AE",
                        color: "white",
                        '&:hover': {
                            backgroundColor: "#607D8B",
                        },
                        borderRadius: '20px',
                        padding: '6px 16px',
                        fontWeight: 'bold',
                    }}
                >
                    <LockIcon sx={{
                        color: "#EF5350",
                        mr: 1
                    }} />
                    Verhaften
                </Button>
            )}
        </ListItem>
    </>
}

export default DevicesInfo;