import { Typography } from "@mui/material";
import { useState } from "react";
import ManhuntSelect from "../components/ManhuntSelect";

const SpeedHuntItem = ({
    manhuntInfo
}) => {
    const [item, setItem] = useState({});

    if (!manhuntInfo || !manhuntInfo.group || !manhuntInfo.speedHunts)
        return null;

    return <>
        <Typography variant="h4" sx={{ fontSize: '24px', fontWeight: 'bold', zIndex: 2 }}>
            Speedhunt läuft auf
        </Typography>

        <ManhuntSelect
            endpoint={"/api/currentManhunt/getHuntedDevices"}
            value={manhuntInfo.isSpeedHuntRunning ? manhuntInfo.lastSpeedHunt?.deviceId : null}
            onChange={(event) => setItem({ ...item, deviceId: Number(event.target.value) })}
            disabled={true}
        />

        <Typography variant="body2" sx={{ fontSize: '14px', zIndex: 2 }}>
            {manhuntInfo.availableSpeedHuntRequests + " Standortanfragen verfügbar"}
        </Typography>
    </>
}

export default SpeedHuntItem;