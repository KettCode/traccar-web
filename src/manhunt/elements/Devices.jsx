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
import fetchOrThrow from '../../common/util/fetchOrThrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';

const Devices = ({
    manhunt,
    reload
}) => {
    const classes = useReportStyles();

    const [devices, setDevices] = useState(null);
    const [jokers, setJokers] = useState(null);

    const [confirmation, setConfirmation] = useState({
        open: false,
        title: "",
        message: "",
        onConfirm: null
    });

    const openConfirmation = ({ title, message, onConfirm }) => {
        setConfirmation({ open: true, title, message, onConfirm });
    }

    const closeConfirmation = () => setConfirmation(prev => ({ ...prev, open: false }));

    const triggerManhuntActions = useTriggerManhuntActions();

    useEffectAsync(async () => {
        const [devicesResponse, jokersResponse] = await Promise.all([
            fetchOrThrow(`/api/currentManhunt/getDevices?manhuntId=${manhunt.id}`),
            fetchOrThrow(`/api/currentManhunt/getJoker?manhuntId=${manhunt.id}&all=${triggerManhuntActions}`)
        ]);

        const devicesData = await devicesResponse.json();
        const jokersData = await jokersResponse.json();

        setDevices(devicesData);
        setJokers(jokersData);
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

    const unlockJoker = useCatch(async (userId, jokerTypeId) => {
        let url = `/api/currentManhunt/unlockJoker?manhuntId=${manhunt.id}&huntedUserId=${userId}&jokerTypeId=${jokerTypeId}`;

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

    const useJoker = useCatch(async (jokerId, deviceId) => {
        let url = `/api/currentManhunt/useJoker?jokerId=${jokerId}&deviceId=${deviceId}`;

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
                                    jokers={jokers ? jokers.filter((j) => j.userId === device.manhuntUserId) : []}
                                    onCatch={(device) => openConfirmation({
                                        title: "Verhaften",
                                        message: "Spieler wirklich verhaften?",
                                        onConfirm: () => createCatch(device)
                                    })}
                                    onUnlockJoker={(userId, jokerTypeId) => openConfirmation({
                                        title: "Joker freischalten",
                                        message: "Joker wirklich freischalten?",
                                        onConfirm: () => unlockJoker(userId, jokerTypeId)
                                    })}
                                    onUseJoker={(jokerId, deviceId) => openConfirmation({
                                        title: "Joker benutzen",
                                        message: "Joker wirklich benutzen?",
                                        onConfirm: () => useJoker(jokerId, deviceId)
                                    })}
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
                                    jokers={[]}
                                    onCatch={(device) => openConfirmation({
                                        title: "Verhaften",
                                        message: "Spieler wirklich verhaften?",
                                        onConfirm: () => createCatch(device)
                                    })}
                                    onUnlockJoker={(userId, jokerTypeId) => openConfirmation({
                                        title: "Joker freischalten",
                                        message: "Joker wirklich freischalten?",
                                        onConfirm: () => unlockJoker(userId, jokerTypeId)
                                    })}
                                    onUseJoker={(jokerId, deviceId) => openConfirmation({
                                        title: "Joker benutzen",
                                        message: "Joker wirklich benutzen?",
                                        onConfirm: () => useJoker(jokerId, deviceId)
                                    })}
                                />
                            )}
                        </List>
                    </AccordionDetails>
                </Accordion >
            </>
        )}
        <ConfirmationDialog
            open={confirmation.open}
            onClose={closeConfirmation}
            title={confirmation.title}
            message={confirmation.message}
            onConfirm={() => {
                closeConfirmation();
                if (confirmation.onConfirm) 
                    confirmation.onConfirm();
            }}
        />
    </>
}

const DeviceListItem = ({
    device,
    jokers,
    onCatch,
    onUnlockJoker,
    onUseJoker
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
        </ListItem >
        <JokerList device={device} jokers={jokers} onUnlockJoker={onUnlockJoker} onUseJoker={onUseJoker} />
    </>
}

const JokerList = ({ device, jokers, onUnlockJoker, onUseJoker }) => {
    const triggerManhuntActions = useTriggerManhuntActions();

    const allJokers = [
        { id: 1, name: "Jägerstandorte erfragen" },
        { id: 2, name: "Nächste Position aussetzten" },
        { id: 3, name: "Speedhunt aufdecken" },
    ];

    if (!jokers || jokers.length === 0) return null;

    return (
        <>
            {jokers.map(j => {
                const type = allJokers.find(t => t.id === j.jokerTypeId);
                if (!type) return null;

                let IconComponent = BlockIcon;
                let buttonAction = null;
                let buttonText = "";
                let iconColor = "grey";

                switch (j.status) {
                    case 0:
                        IconComponent = BlockIcon;
                        iconColor = "#42A5F5";
                        buttonAction = () => onUnlockJoker(device.manhuntUserId, j.jokerTypeId);
                        buttonText = "Freischalten";
                        break;
                    case 1:
                        IconComponent = CheckCircleIcon;
                        iconColor = "#66BB6A";
                        buttonAction = () => onUseJoker(j.id, device.id);
                        buttonText = "Einsetzen";
                        break;
                    case 2:
                        IconComponent = BlockIcon;
                        iconColor = "#EF5350";
                        break;
                    default:
                        IconComponent = BlockIcon;
                        iconColor = "#B0BEC5";
                }

                return (
                    <ListItem
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            pl: 3
                        }}
                    >
                        <Box display="flex" alignItems="center" gap={1}>
                            <IconComponent sx={{ color: iconColor }} />
                            <Typography fontSize="0.875rem" fontWeight="500">
                                {type.name}
                            </Typography>
                        </Box>

                        {triggerManhuntActions && device.manhuntRole == 2 && !device.isCaught && buttonAction && (
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={buttonAction}
                                sx={{
                                    color: buttonText === "Freischalten" ? "#42A5F5" : "#FFB300",
                                    borderColor: buttonText === "Freischalten" ? "#42A5F5" : "#FFB300",
                                    borderRadius: '20px',
                                    padding: '6px 16px',
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    fontSize: '0.75rem',
                                    '&:hover': {
                                        backgroundColor: (buttonText === "Freischalten" ? "#42A5F5" : "#FFB300") + '33',
                                        borderColor: buttonText === "Freischalten" ? "#42A5F5" : "#FFB300"
                                    }
                                }}
                            >
                                {buttonText}
                            </Button>
                        )}
                    </ListItem>
                );
            })}
        </>
    );
};


export default Devices;