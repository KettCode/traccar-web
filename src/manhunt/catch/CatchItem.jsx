import { Button, Typography } from "@mui/material";
import { useState } from "react";
import { useCatch } from "../../reactHelper";
import ManhuntSelect from "../ManhuntSelect";
import ConfirmationDialog from "../ConfirmationDialog";
import ManhuntButton from "../ManhuntButton";

const CatchItem = ({
    onCreated,
    reload
}) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [item, setItem] = useState({});
    const validate = () => item && item.deviceId;

    const createCatch = useCatch(async () => {
        let url = `/api/currentManhunt/createCatch?deviceId=${item.deviceId}`;

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
            Catch
        </Typography>

        <ManhuntSelect
            endpoint={"/api/currentManhunt/getHuntedDevices"}
            value={item.deviceId}
            onChange={(event) => setItem({ ...item, deviceId: Number(event.target.value) })}
            disabled={false}
        />

        <Typography variant="body2" sx={{ fontSize: '14px', zIndex: 2 }}>
            
        </Typography>

        <ManhuntButton 
            text={"Senden"}
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
                createCatch();
            }}
            title="Catch"
            message="Wirklich als gefangen markieren?"
        />
    </>
}

export default CatchItem;