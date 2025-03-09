import { Typography } from "@mui/material";
import ManhuntSelect from "../../components/ManhuntSelect";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { useState } from "react";
import { useCatch } from "../../../reactHelper";
import ManhuntButton from "../../components/ManhuntButton";

const SpeedHuntItem = ({
    speedHuntInfo,
    onCreated,
    reload
}) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [item, setItem] = useState({});

    if (!speedHuntInfo || !speedHuntInfo.group || !speedHuntInfo.speedHunts)
        return null;

    const availableSpeedHunts = speedHuntInfo.group.speedHunts - speedHuntInfo.speedHunts.length;
    const validate = () => item && item.deviceId && availableSpeedHunts > 0;

    const createSpeedHunt = useCatch(async () => {
        let url = `/api/currentManhunt/createSpeedHunt?deviceId=${item.deviceId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
        });

        if (response.ok) {
            onCreated()
        } else {
            reload();
            throw Error(await response.text());
        }
    });


    return <>
        <Typography variant="h4" sx={{ fontSize: '24px', fontWeight: 'bold', zIndex: 2 }}>
            Speedhunt
        </Typography>

        <ManhuntSelect
            endpoint={"/api/currentManhunt/getHuntedDevices"}
            value={item.deviceId}
            onChange={(event) => setItem({ ...item, deviceId: Number(event.target.value) })}
            disabled={false}
        />

        <Typography variant="body2" sx={{ fontSize: '14px', zIndex: 2 }}>
            {availableSpeedHunts + " Speedhunts verfügbar"}
        </Typography>

        <ManhuntButton 
            text={"Starten"}
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
                createSpeedHunt();
            }}
            title="Speedhunt"
            message={
                <span>
                    Speedhunt wirklich starten?
                    <br/>
                    Die erste Standortanfrage wird sofort ausgeführt.
                </span>
            }
        />
    </>
}

export default SpeedHuntItem;