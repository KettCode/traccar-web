import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton, TextField } from '@mui/material';
import useSettingsStyles from '../settings/common/useSettingsStyles';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import SelectField from '../common/components/SelectField';
import MainMap from '../main/MainMap';
import PageLayout from '../common/components/PageLayout';
import ManhuntsMenu from './components/ManhuntsMenu';
import fetchOrThrow from '../common/util/fetchOrThrow';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

dayjs.extend(utc);

const GameReplayPage = ({
}) => {
    const { classes } = useSettingsStyles();

    const [deviceIds, setDeviceIds] = useState([]);
    const [fixTime, setFixTime] = useState("2026-03-14T10:30");
    const [filteredPositions, setFilteredPositions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPositions = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                deviceIds.forEach((deviceId) => params.append('deviceId', deviceId));
                params.append("fixTime", dayjs(fixTime).utc().format());

                const response = await fetchOrThrow(`/api/currentManhunt/getLatestPositionsForTime?${params.toString()}`);
                setFilteredPositions(await response.json());
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPositions();
    }, [deviceIds, fixTime]);

    const jumpTime = (minutes) => {
        const newTime = dayjs(fixTime).add(minutes, 'minute').format('YYYY-MM-DDTHH:mm');
        setFixTime(newTime);
    };

    return <>
        <PageLayout menu={<ManhuntsMenu/>} breadcrumbs={['reportTitle', 'reportPositions']}>
            <div className={classes.container} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', gap: '16px', padding: '8px 0' }}>
                    <SelectField
                        multiple
                        value={deviceIds}
                        onChange={(e) => setDeviceIds(e.target.value)}
                        endpoint="/api/devices"
                        label="Geräte"
                        fullWidth
                    />
                    <TextField
                        label="Uhrzeit"
                        type="datetime-local"
                        value={dayjs.utc(fixTime).local().format('YYYY-MM-DDTHH:mm')}
                        onChange={(e) => setFixTime(dayjs(e.target.value).utc().format('YYYY-MM-DDTHH:mm'))}
                        fullWidth
                    />
                    <Box display="flex" gap={0.5}>
                        <IconButton onClick={() => jumpTime(-5)} title="-5 min"><ArrowBackIcon /></IconButton>
                        <IconButton onClick={() => jumpTime(-1)} title="-1 min"><ArrowBackIcon /></IconButton>
                        <IconButton onClick={() => jumpTime(1)} title="+1 min"><ArrowForwardIcon /></IconButton>
                        <IconButton onClick={() => jumpTime(5)} title="+5 min"><ArrowForwardIcon /></IconButton>
                    </Box>
                </div>
                <div style={{ flex: 1, width: '100%' }}>
                    <MainMap
                        filteredPositions={filteredPositions}
                        selectedPosition={null}
                        onEventsClick={() => {}}
                    />
                </div>
            </div>
        </PageLayout>
    </>
}

export default GameReplayPage;