import React, { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography } from '@mui/material';
import { useCatch, useEffectAsync } from '../../reactHelper';
import ConfirmationDialog from './ConfirmationDialog';
import { useTriggerManhuntActions } from '../../common/util/permissions';
import SelectField from '../../common/components/SelectField';
import useSettingsStyles from '../../settings/common/useSettingsStyles';
import { useSelector } from 'react-redux';

const SpeedHunt = ({
    manhunt,
    reload
}) => {
    const classes = useSettingsStyles();
    const [lastSpeetHunt, setLastSpeedHunt] = useState(null);

    useEffectAsync(async () => {
        const response = await fetch(`/api/currentManhunt/getLastSpeedHunt?manhuntId=${manhunt.id}`);
        if (response.ok) {
            setLastSpeedHunt(await response.json());
        } else {
            throw Error(await response.text());
        }
    }, [manhunt]);

    const isSpeedHuntRunning = lastSpeetHunt
        && !lastSpeetHunt.deviceIsCaught
        && lastSpeetHunt.numRequests < manhunt.locationRequests;

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
                {isSpeedHuntRunning ?
                    <SpeedHuntIsRunningItem
                        manhunt={manhunt}
                        lastSpeetHunt={lastSpeetHunt}
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
    lastSpeetHunt,
    reload
}) => {
    const triggerManhuntActions = useTriggerManhuntActions();
    const user = useSelector((state) => state.session.user);
    const [dialogOpen, setDialogOpen] = useState(false);

    const createLocationRequest = useCatch(async () => {
        let url = `/api/currentManhunt/createLocationRequest?manhuntId=${manhunt.id}&speedHuntId=${lastSpeetHunt.id}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            reload();
            if (lastSpeetHunt.availableSpeedHuntRequests > 1) {
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
        <Typography sx={{
            textAlign: "center"
        }}>
            {`Speedhunt läuft ${user.manhuntRole == 1 ? "auf " + lastSpeetHunt.deviceName : ""}`}
        </Typography>
        <Typography sx={{
            textAlign: "center",
            color: "gray",
            fontSize: "1rem"
        }}>
            {manhunt.locationRequests - lastSpeetHunt.numRequests + " Standortanfragen verfügbar"}
        </Typography>
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
    const validate = () => selectedDevice && selectedDevice.id; //available SpeedHunts

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

    return <>
        <Typography sx={{
            textAlign: "center"
        }}>
            Aktuell läuft kein Speedhunt
        </Typography>
        <Typography sx={{
            textAlign: "center",
            color: "gray",
            fontSize: "1rem"
        }}>
            {0 + " Speedhunts verfügbar"}
        </Typography>
        {triggerManhuntActions && (
            <>
                <SelectField
                    label={"Spieler"}
                    endpoint={"/api/currentManhunt/getHuntedDevices"}
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