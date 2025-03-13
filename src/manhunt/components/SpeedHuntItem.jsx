import { Typography } from "@mui/material";
import ManhuntSelect from "./ManhuntSelect";
import ConfirmationDialog from "./ConfirmationDialog";
import { useState } from "react";
import { useCatch } from "../../reactHelper";
import ManhuntButton from "./ManhuntButton";
import { useSelector } from "react-redux";

const SpeedHuntItem = ({
    speedHuntInfo,
    reload
}) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [item, setItem] = useState({});
    const user = useSelector((state) => state.session.user);

    if (!speedHuntInfo || !speedHuntInfo.speedHunts)
        return null;

    const availableSpeedHunts = user.group.speedHunts - speedHuntInfo.speedHunts.length;
    const validate = () => item && item.deviceId && availableSpeedHunts > 0;

    const createSpeedHunt = useCatch(async () => {
        let url = `/api/currentManhunt/createSpeedHunt?deviceId=${item.deviceId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
        });

        if (response.ok) {
            reload();
        } else {
            reload();
            throw Error(await response.text());
        }
    });

    if (user.group?.manhuntRole == 2)
        return <Typography variant="h4" sx={{ fontSize: '24px', fontWeight: 'bold', zIndex: 2 }}>
            Aktuell läuft kein Speedhunt
        </Typography>

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
                    <br />
                    Die erste Standortanfrage wird sofort ausgeführt.
                </span>
            }
        />
    </>
}

export default SpeedHuntItem;