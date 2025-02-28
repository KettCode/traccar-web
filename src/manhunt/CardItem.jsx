import { useState } from "react";
import ConfirmationDialog from "./ConfirmationDialog";
import ManhuntButton from "./ManhuntButton";
import { Typography } from "@mui/material";

const CardItem = ({
    onConfirm,
    title,
    description,
    buttonText,
    dialogMessage,
    select
}) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    return <>
        <Typography variant="h4" sx={{ fontSize: '24px', fontWeight: 'bold', zIndex: 2 }}>
            {title}
        </Typography>

        {select}

        <Typography variant="body2" sx={{ fontSize: '14px', zIndex: 2 }}>
            {description}
        </Typography>

        <ManhuntButton 
            text={buttonText}
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
                onConfirm()
            }}
            title={title}
            message={dialogMessage}
        />
    </>
}

export default CardItem;