import { Button, Typography } from "@mui/material";
import { useState } from "react";
import { useCatch } from "../reactHelper";
import SpeedHuntSelect from "../speedHunt/SpeedHuntSelect";
import ConfirmationDialog from "../speedHunt/ConfirmationDialog";

const CatchItem = ({
    onCreated,
    reload
}) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [item, setItem] = useState({});
    const validate = () => item && item.deviceId;

    const createCatch = useCatch(async () => {
        let url = `/api/catches/create?deviceId=${item.deviceId}`;

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

        <SpeedHuntSelect
            endpoint={"/api/manhunts/huntedDevices"}
            value={item.deviceId}
            onChange={(event) => setItem({ ...item, deviceId: Number(event.target.value) })}
            disabled={false}
        />

        <Typography variant="body2" sx={{ fontSize: '14px', zIndex: 2 }}>
            
        </Typography>


        <Button
            variant="contained"
            color="secondary"
            onClick={() => setDialogOpen(true)}
            disabled={!validate()}
            sx={{
                marginTop: '10px',
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
                Senden
            </Typography>
        </Button>
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