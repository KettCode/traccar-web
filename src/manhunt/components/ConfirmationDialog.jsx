import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';

const ConfirmationDialog = ({ open, onClose, onConfirm, title, message }) => {
    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="xs"
            fullWidth >
            <DialogTitle sx={{ fontWeight: 600 }}>{title}</DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary">
                    {message}
                </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={onClose}
                    style={{ color: "#ff6f61" }}>
                    Abbrechen
                </Button>
                <Button
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                    style={{ color: "#4caf50" }}
                >
                    Bestätigen
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;