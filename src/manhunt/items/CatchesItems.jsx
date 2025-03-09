import React from 'react';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

const CatchesItems = ({
    manhuntInfo
}) => {
    return <List>
        <div style={{
            backgroundColor: "white"
        }}>
            {manhuntInfo.catches && manhuntInfo.catches.map((singleCatch) => (
                <CatchItem
                    manhuntInfo={manhuntInfo}
                    singleCatch={singleCatch}
                />
            ))}
            {manhuntInfo.huntedDevices && manhuntInfo.huntedDevices.map((huntedDevice) => (
                <HuntedItem
                    manhuntInfo={manhuntInfo}
                    huntedDevice={huntedDevice}
                />
            ))}
        </div>
    </List>
}

const CatchItem = ({
    manhuntInfo,
    singleCatch
}) => {
    return <>
        <ListItem style={{
            boxShadow: "0px 2px 1px -1px rgba(0, 0, 0, 0), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)"
        }}>
            <ListItemIcon>
                <LockIcon sx={{
                    color: "#EF5350"
                }} />
            </ListItemIcon>
            <ListItemText>
                {`${manhuntInfo.devices.find(x => x.id == singleCatch.deviceId)?.name}`}
            </ListItemText>
        </ListItem>
    </>
}

const HuntedItem = ({
    manhuntInfo,
    huntedDevice
}) => {
    return <>
        <ListItem style={{
            boxShadow: "0px 2px 1px -1px rgba(0, 0, 0, 0), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)"
        }}>
            <ListItemIcon>
                <LockOpenIcon sx={{
                    color: "#66BB6A"
                }} />
            </ListItemIcon>
            <ListItemText>
                {`${manhuntInfo.devices.find(x => x.id == huntedDevice.id)?.name}`}
            </ListItemText>
        </ListItem>
    </>
}

export default CatchesItems;