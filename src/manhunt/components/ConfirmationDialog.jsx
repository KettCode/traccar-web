import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const ConfirmationDialog = ({ open, onClose, onConfirm, title, message }) => {
    const css = {
        fontSize: '14px',
        color: "white",
        backgroundColor: '#33aaff',
        background: 'radial-gradient(circle at 100px 100px, #33aaff, #000)'
    }

    return (
        <Dialog open={open} onClose={onClose} >
            <div style={css}>
                <DialogTitle >{title}</DialogTitle>
                <DialogContent >{message}</DialogContent>
                <DialogActions >
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
            </div>
        </Dialog>
    );
};

export default ConfirmationDialog;