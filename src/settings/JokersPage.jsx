import React, { useState } from 'react';
import {
    Table, TableRow, TableCell, TableHead, TableBody
} from '@mui/material';
import { useEffectAsync } from '../reactHelper';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import SettingsMenu from './components/SettingsMenu';
import CollectionActions from './components/CollectionActions';
import TableShimmer from '../common/components/TableShimmer';
import SearchHeader, { filterByKeyword } from './components/SearchHeader';
import { useRestriction } from '../common/util/permissions';
import useSettingsStyles from './common/useSettingsStyles';
import { useNavigate } from 'react-router-dom';
import CollectionFab from './components/CollectionFab';
import { formatTime } from '../common/util/formatter';

const JokersPage = () => {
    const classes = useSettingsStyles();
    const t = useTranslation();

    const [timestamp, setTimestamp] = useState(Date.now());
    const [items, setItems] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [loading, setLoading] = useState(false);
    const limitCommands = useRestriction('limitCommands');
    const [users, setUsers] = useState([]);
    const [jokerTypes, setJokerTypes] = useState([]);
    const [jokerStates, setJokerStates] = useState([]);
    const navigate = useNavigate();

    useEffectAsync(async () => {
        setLoading(true);
        try {
            const responseRequests = await fetch('/api/jokers?all=true');
            if (responseRequests.ok) {
                setItems(await responseRequests.json());
            } else {
                throw Error(await responseRequests.text());
            }
        } finally {
            setLoading(false);
        }
    }, [timestamp]);

    useEffectAsync(async () => {
        try {
            const [usersRes, typesRes, statesRes] = await Promise.all([
                fetch('/api/users'),
                fetch('/api/jokers/getJokerTypes'),
                fetch('/api/jokers/getJokerStates')
            ]);
    
            if (!usersRes.ok) throw new Error(`Users HTTP error! Status: ${usersRes.status}`);
            if (!typesRes.ok) throw new Error(`JokerTypes HTTP error! Status: ${typesRes.status}`);
            if (!statesRes.ok) throw new Error(`JokerStates HTTP error! Status: ${statesRes.status}`);
    
            setUsers(await usersRes.json());
            setJokerTypes(await typesRes.json());
            setJokerStates(await statesRes.json());
    
        } catch (error) {
            setError(error.message);
        }
    }, []);

    return <PageLayout menu={<SettingsMenu />} breadcrumbs={['settingsTitle', 'sharedSavedCommands']}>
        <SearchHeader keyword={searchKeyword} setKeyword={setSearchKeyword} />
        <Table className={classes.table}>
            <TableHead>
                <TableRow>
                    <TableCell>{'Id'}</TableCell>
                    <TableCell>{'Manhuntid'}</TableCell>
                    <TableCell>{t('settingsUsers')}</TableCell>
                    <TableCell>{'Joker'}</TableCell>
                    <TableCell>{'Status'}</TableCell>
                    <TableCell>{'Freigeschaltet um'}</TableCell>
                    <TableCell>{'Eingesetzt um'}</TableCell>
                    <TableCell className={classes.columnAction} />
                </TableRow>
            </TableHead>
            <TableBody>
                {!loading ? items.filter(filterByKeyword(searchKeyword)).map((item) => (
                    <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.manhuntsId}</TableCell>
                        <TableCell>{item.userId ? users.find(x => x.id == item.userId)?.name : null}</TableCell>
                        <TableCell>{item.jokerTypeId ? jokerTypes.find(x => x.id == item.jokerTypeId)?.name : null}</TableCell>
                        <TableCell>{item.status ? jokerStates.find(x => x.id == item.status)?.name : null}</TableCell>
                        <TableCell>{formatTime(item.unlockedAt, "minutes")}</TableCell>
                        <TableCell>{formatTime(item.usedAt, "minutes")}</TableCell>
                        <TableCell className={classes.columnAction} padding="none">
                            <CollectionActions itemId={item.id} editPath="/settings/joker" endpoint="jokers" setTimestamp={setTimestamp} />
                        </TableCell>
                    </TableRow>
                )) : (<TableShimmer columns={limitCommands ? 3 : 4} endAction />)}
            </TableBody>
        </Table>
        <CollectionFab editPath="/settings/joker" />
    </PageLayout>;
}

export default JokersPage;