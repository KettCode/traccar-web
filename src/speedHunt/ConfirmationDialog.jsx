import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const ConfirmationDialog = ({ open, onClose, onConfirm, title, message }) => {
    const css = {
        fontSize: '14px',
        //borderRadius: '25px',
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
                    <Button onClick={onClose} color='error'>
                        Abbrechen
                    </Button>
                    <Button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        color="success"
                    >
                        Bestätigen
                    </Button>
                </DialogActions>
            </div>
        </Dialog>
    );
};

export default ConfirmationDialog;