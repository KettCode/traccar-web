import React, { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GavelIcon from '@mui/icons-material/Gavel';
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Snackbar, Typography } from '@mui/material';
import { useCatch, useEffectAsync } from '../../reactHelper';
import ConfirmationDialog from '../components/ConfirmationDialog';
import SelectField from '../../common/components/SelectField';
import useSettingsStyles from '../../settings/common/useSettingsStyles';


const Punishment = ({
    manhunt,
    reload
}) => {
    const { classes } = useSettingsStyles();
    const [huntedDevices, setHuntedDevices] = useState(null);

    useEffectAsync(async () => {
        const response = await fetch(`/api/currentManhunt/getDevices?manhuntId=${manhunt.id}&huntedOnly=true`);
        if (response.ok) {
            setHuntedDevices(await response.json());
        } else {
            throw Error(await response.text());
        }
    }, [manhunt]);

    return <>
        <Accordion defaultExpanded={false}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" alignItems="center">
                    <GavelIcon sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">
                        {"Bestrafung"}
                    </Typography>
                </Box>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
                    <RefreshManhuntLocationItem
                        manhunt={manhunt}
                        reload={reload}
                    />
            </AccordionDetails>
        </Accordion >
    </>
}

const RefreshManhuntLocationItem = ({
    manhunt,
    reload
}) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const refreshManhuntLocation = useCatch(async () => {
        let url = `/api/currentManhunt/refreshManhuntLocation?manhuntId=${manhunt.id}&deviceId=${selectedDevice.id}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            reload();
            setSnackbarOpen(true);
        } else {
            reload();
            throw Error(await response.text());
        }
    });

    const validate = () => selectedDevice && selectedDevice.id;

    return <>
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
            {"Standort aufdecken"}
        </Button>
        <ConfirmationDialog
            open={dialogOpen}
            onClose={() => {
                setDialogOpen(false);
            }}
            onConfirm={() => {
                setDialogOpen(false);
                refreshManhuntLocation();
            }}
            title="Standort aufdecken"
            message={
                <span>
                    Soll der Standort wirklich aufgedeckt werden?
                    <br />
                    Der aktuelle Standort wird den Jägern direkt angezeigt.
                </span>
            }
        />
        <Snackbar
            open={snackbarOpen}
            autoHideDuration={4000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert
                onClose={() => setSnackbarOpen(false)}
                severity={"success"}
                variant="filled"
            >
                {"Der Standort wurde erfolgreich aufgedeckt."}
            </Alert>
        </Snackbar>
    </>
}

export default Punishment;