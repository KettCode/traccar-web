import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Accordion, AccordionDetails, AccordionSummary, Box, TextField, Typography } from '@mui/material';
import useSettingsStyles from '../../settings/common/useSettingsStyles';
import { formatTime } from '../../common/util/formatter';

const Location = ({
    manhunt
}) => {
    const { classes } = useSettingsStyles();

    return <>
        <Accordion defaultExpanded={true}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" alignItems="center">
                    <LocationOnIcon />
                    <Typography variant="subtitle1">
                        {"Standort"}
                    </Typography>
                </Box>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
                <TextField
                    label={'Nächste Meldung'}
                    value={formatTime(manhunt.nextLocationReport, 'minutes')}
                    fullWidth
                    disabled={true}
                />
            </AccordionDetails>
        </Accordion >
    </>
}

export default Location;