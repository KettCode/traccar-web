import React, { useState } from 'react';
import {
    Table, TableRow, TableCell, TableHead, TableBody,
    Fab,
} from '@mui/material';
import { useEffectAsync } from '../reactHelper';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import SettingsMenu from './components/SettingsMenu';
import CollectionActions from './components/CollectionActions';
import TableShimmer from '../common/components/TableShimmer';
import SearchHeader, { filterByKeyword } from './components/SearchHeader';
import { useAdministrator, useRestriction } from '../common/util/permissions';
import useSettingsStyles from './common/useSettingsStyles';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useNavigate } from 'react-router-dom';
import CollectionFab from './components/CollectionFab';

dayjs.extend(utc);

const CatchesPage = () => {
    const classes = useSettingsStyles();
    const t = useTranslation();

    const devices = useSelector((state) => state.devices.items);
    const groups = useSelector((state) => state.groups.items);
    const [timestamp, setTimestamp] = useState(Date.now());
    const [items, setItems] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [loading, setLoading] = useState(false);
    const limitCommands = useRestriction('limitCommands');
    const navigate = useNavigate();

    useEffectAsync(async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/catches?all=true');
            if (response.ok) {
                setItems(await response.json());
            } else {
                throw Error(await response.text());
            }
        } finally {
            setLoading(false);
        }
    }, [timestamp]);


    return <PageLayout menu={<SettingsMenu />} breadcrumbs={['settingsTitle', 'sharedSavedCommands']}>
        <SearchHeader keyword={searchKeyword} setKeyword={setSearchKeyword} />
        <Table className={classes.table}>
            <TableHead>
                <TableRow>
                    <TableCell>{'Id'}</TableCell>
                    <TableCell>{'Manhuntid'}</TableCell>
                    <TableCell>{'Anfragesteller (Gruppe)'}</TableCell>
                    <TableCell>{'Zielgerät'}</TableCell>
                    <TableCell>{'Gefangen um'}</TableCell>
                    <TableCell className={classes.columnAction} />
                </TableRow>
            </TableHead>
            <TableBody>
                {!loading ? items.filter(filterByKeyword(searchKeyword)).map((item) => (
                    <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.manhuntsId}</TableCell>
                        <TableCell>{item.hunterGroupId ? groups[item.hunterGroupId]?.name : null}</TableCell>
                        <TableCell>{item.deviceId ? devices[item.deviceId].name : null}</TableCell>
                        <TableCell>{dayjs.utc(item.time).local().format('DD.MM.YYYY HH:mm')}</TableCell>
                        <TableCell className={classes.columnAction} padding="none">
                            <CollectionActions itemId={item.id} editPath="/settings/catch" endpoint="catches" setTimestamp={setTimestamp} />
                        </TableCell>
                    </TableRow>
                )) : (<TableShimmer columns={limitCommands ? 3 : 4} endAction />)}
            </TableBody>
        </Table>
        <CollectionFab editPath="/settings/catch" />
    </PageLayout>
};

export default CatchesPage;
