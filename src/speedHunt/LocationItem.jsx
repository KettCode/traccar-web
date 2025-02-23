import { Button, Typography } from "@mui/material";
import SpeedHuntSelect from "./SpeedHuntSelect";
import ConfirmationDialog from "./ConfirmationDialog";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useState } from "react";
import { useCatch } from "../reactHelper";

const LocationItem = ({
    speedHuntInfo,
    onCreated
}) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const lastSpeedHunt = speedHuntInfo.speedHunts[speedHuntInfo.speedHunts.length - 1];
    const availableSpeedHuntReqeuests = speedHuntInfo.group.speedHuntRequests - lastSpeedHunt.speedHuntRequests.length;
    const validate = () => lastSpeedHunt && lastSpeedHunt.deviceId && availableSpeedHuntReqeuests > 0;

    const createSpeedHuntRequest = useCatch(async () => {
        let url = `/api/speedHuntRequests/create?speedHuntId=${lastSpeedHunt.id}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lastSpeedHunt),
        });

        if (response.ok) {
            onCreated();
        } else {
            throw Error(await response.text());
        }
    });

    return <>
        <LocationOnIcon style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            color: 'rgba(255, 255, 255, 0.3',
            zIndex: 1
        }} />

        <Typography variant="h4" sx={{ fontSize: '24px', fontWeight: 'bold', zIndex: 2 }}>
            Standort
        </Typography>

        <SpeedHuntSelect
            endpoint={"/api/manhunts/huntedDevices"}
            value={lastSpeedHunt.deviceId}
            disabled={true}
        />

        <Typography variant="body2" sx={{ fontSize: '12px', zIndex: 2 }}>
            {availableSpeedHuntReqeuests + " Standortanfragen verfügbar"}
        </Typography>


        <Button
            variant="contained"
            color="secondary"
            onClick={() => setDialogOpen(true)}
            disabled={!validate()}
            sx={{
                fontSize: '14px',
                width: '120px',
                height: '45px',
                borderRadius: '25px',
                backgroundColor: '#33aaff',
                background: 'radial-gradient(circle at 100px 100px, #33aaff, #000)',
                '&:hover': {
                    backgroundColor: '#0277bd',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                },
                '&:active': {
                    backgroundColor: '#01579b',
                    boxShadow: 'none',
                },
                '&.Mui-disabled': {
                    color: '#D0D0D0',
                    opacity: 1
                },
                zIndex: 2
            }}
        >
            <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                Anfragen
            </Typography>
        </Button>
        <ConfirmationDialog
            open={dialogOpen}
            onClose={() => {
                setDialogOpen(false);
            }}
            onConfirm={() => {
                setDialogOpen(false);
                createSpeedHuntRequest();
            }}
            title="Standort"
            message="Standort wirklich anfragen?"
        />
    </>
}

export default LocationItem;