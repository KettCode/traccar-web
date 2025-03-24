import React, { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import { useCatch, useEffectAsync } from '../../reactHelper';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { useTriggerManhuntActions } from '../../common/util/permissions';
import SelectField from '../../common/components/SelectField';
import useSettingsStyles from '../../settings/common/useSettingsStyles';
import { useSelector } from 'react-redux';

const SpeedHunt = ({
    manhunt,
    reload
}) => {
    const classes = useSettingsStyles();
    const [huntedDevices, setHuntedDevices] = useState(null);

    useEffectAsync(async () => {
        const response = await fetch(`/api/currentManhunt/getDevices?manhuntId=${manhunt.id}&huntedOnly=true`);
        if (response.ok) {
            setHuntedDevices(await response.json());
        } else {
            throw Error(await response.text());
        }
    }, [manhunt]);

    const lastSpeedHunt = manhunt.speedHunts.length > 0 ? manhunt.speedHunts[manhunt.speedHunts.length - 1] : null;
    const isSpeedHuntRunning = lastSpeedHunt
        && lastSpeedHunt.locationRequests.length < manhunt.locationRequestLimit
        && huntedDevices
        && huntedDevices.some(x => x.id == lastSpeedHunt.deviceId);

    return <>
        <Accordion defaultExpanded={true}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" alignItems="center">
                    <DirectionsRunIcon />
                    <Typography variant="subtitle1">
                        {"Speedhunt"}
                    </Typography>
                </Box>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
                <FormControlLabel
                    control={<Checkbox checked={isSpeedHuntRunning} disabled={true} />}
                    label={'Aktiv'}
                />
                {isSpeedHuntRunning ?
                    <SpeedHuntIsRunningItem
                        manhunt={manhunt}
                        lastSpeedHunt={lastSpeedHunt}
                        reload={reload}
                    /> :
                    <SpeedHuntIsNotRunningItem
                        manhunt={manhunt}
                        reload={reload}
                    />
                }
            </AccordionDetails>
        </Accordion >
    </>
}

const SpeedHuntIsRunningItem = ({
    manhunt,
    lastSpeedHunt,
    reload
}) => {
    const triggerManhuntActions = useTriggerManhuntActions();
    const user = useSelector((state) => state.session.user);
    const [dialogOpen, setDialogOpen] = useState(false);
    const availableLocationRequests = manhunt.locationRequestLimit - lastSpeedHunt.locationRequests.length;

    const createLocationRequest = useCatch(async () => {
        let url = `/api/currentManhunt/createLocationRequest?manhuntId=${manhunt.id}&speedHuntId=${lastSpeedHunt.id}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            reload();
            if (availableLocationRequests > 1) {
                //setShowAnimation(true);
                //setTimeout(() => {
                //    setShowAnimation(false);
                //}, 2000);
            }
        } else {
            reload();
            throw Error(await response.text());
        }
    });

    return <>
        <TextField
            type="number"
            value={availableLocationRequests}
            label={"Verfügbare Standortanfragen"}
            disabled={true}
        />
        {user.manhuntRole == 1 && (
            <SelectField
                label={"Spieler"}
                endpoint={`/api/currentManhunt/getDevices?manhuntId=${manhunt.id}&huntedOnly=true`}
                value={lastSpeedHunt.deviceId}
                disabled={true}
            />
        )}
        {triggerManhuntActions && (
            <Button
                type="button"
                color="secondary"
                variant="outlined"
                onClick={() => setDialogOpen(true)}
            >
                {"Standort anfragen"}
            </Button>
        )}
        <ConfirmationDialog
            open={dialogOpen}
            onClose={() => {
                setDialogOpen(false);
            }}
            onConfirm={() => {
                setDialogOpen(false);
                createLocationRequest();
            }}
            title="Standort"
            message="Standort wirklich anfragen?"
        />
    </>
}

const SpeedHuntIsNotRunningItem = ({
    manhunt,
    reload
}) => {
    const triggerManhuntActions = useTriggerManhuntActions();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);

    const createSpeedHunt = useCatch(async () => {
        let url = `/api/currentManhunt/createSpeedHunt?manhuntId=${manhunt.id}&deviceId=${selectedDevice.id}`;

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

    const availableSpeedHunts = manhunt.speedHuntLimit - (manhunt.speedHunts ? manhunt.speedHunts.length : 0);
    const validate = () => selectedDevice && selectedDevice.id && availableSpeedHunts > 0;

    return <>
        <TextField
            type="number"
            value={availableSpeedHunts}
            label={"Verfügbare Speedhunts"}
            disabled={true}
        />
        {triggerManhuntActions && (
            <>
                <SelectField
                    label={"Spieler"}
                    endpoint={`/api/currentManhunt/getDevices?manhuntId=${manhunt.id}&huntedOnly=true`}
                    value={selectedDevice?.id}
                    onChange={(event) => setSelectedDevice({ ...selectedDevice, id: Number(event.target.value) })}
                    disabled={false}
                />
                <Button
                    type="button"
                    color="secondary"
                    variant="outlined"
                    onClick={() => setDialogOpen(true)}
                    disabled={!validate()}
                >
                    {"Speedhunt starten"}
                </Button>
            </>
        )}
        <ConfirmationDialog
            open={dialogOpen}
            onClose={() => {
                setDialogOpen(false);
            }}
            onConfirm={() => {
                setDialogOpen(false);
                createSpeedHunt();
            }}
            title="Speedhunt"
            message={
                <span>
                    Speedhunt wirklich starten?
                    <br />
                    Die erste Standortanfrage wird sofort ausgeführt.
                </span>
            }
        />
    </>
}

export default SpeedHunt;