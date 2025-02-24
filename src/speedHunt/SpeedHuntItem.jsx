import { Button, Typography } from "@mui/material";
import SpeedHuntSelect from "./SpeedHuntSelect";
import ConfirmationDialog from "./ConfirmationDialog";
import { useState } from "react";
import { useCatch } from "../reactHelper";

const SpeedHuntItem = ({
    speedHuntInfo,
    onCreated
}) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [item, setItem] = useState({});

    const availableSpeedHunts = speedHuntInfo.group.speedHunts - speedHuntInfo.speedHunts.length;
    const validate = () => item && item.deviceId && availableSpeedHunts > 0;

    const createSpeedHunt = useCatch(async () => {
        let url = `/api/speedHunts/create?deviceId=${item.deviceId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
        });

        if (response.ok) {
            onCreated(true)
        } else {
            throw Error(await response.text());
        }
    });


    return <>
        <Typography variant="h4" sx={{ fontSize: '24px', fontWeight: 'bold', zIndex: 2 }}>
            Speedhunt
        </Typography>

        <SpeedHuntSelect
            endpoint={"/api/manhunts/huntedDevices"}
            value={item.deviceId}
            onChange={(event) => setItem({ ...item, deviceId: Number(event.target.value) })}
            disabled={false}
        />

        <Typography variant="body2" sx={{ fontSize: '12px', zIndex: 2 }}>
            {availableSpeedHunts + " Speedhunts verfügbar"}
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
                Starten
            </Typography>
        </Button>
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
            message="Speedhunt wirklich starten?"
        />
    </>
}

export default SpeedHuntItem;