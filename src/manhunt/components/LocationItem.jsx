import { Typography } from "@mui/material";
import ManhuntSelect from "./ManhuntSelect";
import ConfirmationDialog from "./ConfirmationDialog";
import { useState } from "react";
import { useCatch } from "../../reactHelper";
import ManhuntButton from "./ManhuntButton";

const LocationItem = ({
    speedHuntInfo,
    onCreated,
    reload
}) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);

    if (!speedHuntInfo || !speedHuntInfo.lastSpeedHunt)
        return null;

    const validate = () => speedHuntInfo.lastSpeedHunt && speedHuntInfo.lastSpeedHunt.deviceId && speedHuntInfo.lastSpeedHunt.availableSpeedHuntRequests > 0;

    const createSpeedHuntRequest = useCatch(async () => {
        let url = `/api/currentManhunt/createSpeedHuntRequest?speedHuntId=${speedHuntInfo.lastSpeedHunt.id}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(speedHuntInfo.lastSpeedHunt),
        });

        if (response.ok) {
            onCreated();
            if (speedHuntInfo.lastSpeedHunt?.availableSpeedHuntRequests > 1) {
                setShowAnimation(true);
                setTimeout(() => {
                    setShowAnimation(false);
                }, 2000);
            }
        } else {
            reload();
            throw Error(await response.text());
        }
    });

    return <>
        <Typography variant="h4" sx={{ fontSize: '24px', fontWeight: 'bold', zIndex: 2 }}>
            Standort
        </Typography>

        <ManhuntSelect
            endpoint={"/api/currentManhunt/getHuntedDevices"}
            value={speedHuntInfo.lastSpeedHunt?.deviceId}
            disabled={true}
        />

        <Typography variant="body2" sx={{
            fontSize: '14px',
            zIndex: 2,
            animation: showAnimation ? 'popinTextBox 2s 1 ease' : "none"
        }}>
            {speedHuntInfo.lastSpeedHunt?.availableSpeedHuntRequests + " Standortanfragen verfügbar"}
        </Typography>

        <ManhuntButton 
            text={"Anfragen"}
            onClick={() => setDialogOpen(true)}
            disabled={!validate()}
        />
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
        <style>
            {
                `
                @keyframes popinTextBox {
                    0% {
                        transform: scale(0);
                    }
                    25% {
                        color: #F0F0F0;
                        transform: scale(2);
                    }
                    50% {
                        color: #F0F0F0;
                        transform: scale(1);
                    }
                    100% {
                        color: white;
                        transform: scale(1);
                    }
                }
                `
            }
        </style>
    </>
}

export default LocationItem;