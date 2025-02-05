import React, { useState } from 'react';
import {
  Table, TableRow, TableCell, TableHead, TableBody,
} from '@mui/material';
import { useEffectAsync } from '../reactHelper';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import SettingsMenu from './components/SettingsMenu';
import CollectionFab from './components/CollectionFab';
import CollectionActions from './components/CollectionActions';
import TableShimmer from '../common/components/TableShimmer';
import SearchHeader, { filterByKeyword } from './components/SearchHeader';
import { useRestriction } from '../common/util/permissions';
import useSettingsStyles from './common/useSettingsStyles';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

const SpeedhuntsPage = () => {
const classes = useSettingsStyles();
  const t = useTranslation();

  const devices = useSelector((state) => state.devices.items);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [items, setItems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const limitCommands = useRestriction('limitCommands');
  const [users, setUsers] = useState([]);

  useEffectAsync(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/speedhunts?all=true');
      if (response.ok) {
        setItems(await response.json());
      } else {
        throw Error(await response.text());
      }
    } finally {
      setLoading(false);
    }
  }, [timestamp]);

  useEffectAsync(async () => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUsers();
  }, []);

    return  <PageLayout menu={<SettingsMenu />} breadcrumbs={['settingsTitle', 'sharedSavedCommands']}>
      <SearchHeader keyword={searchKeyword} setKeyword={setSearchKeyword} />
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>{'Ausgelöst von'}</TableCell>
            <TableCell>{'Zielgerät'}</TableCell>
            <TableCell>{'Zeitpunkt'}</TableCell>
            <TableCell className={classes.columnAction} />
          </TableRow>
        </TableHead>
        <TableBody>
          {!loading ? items.filter(filterByKeyword(searchKeyword)).map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.userId ? users.find(x => x.id ==item.userId)?.name : null}</TableCell>
              <TableCell>{item.deviceId ? devices[item.deviceId].name : null}</TableCell>
              <TableCell>{dayjs.utc(item.time).local().format('DD.MM.YYYY HH:mm')}</TableCell>
              <TableCell className={classes.columnAction} padding="none">
                  <CollectionActions itemId={item.id} editPath="/settings/speedhunt" endpoint="speedhunts" setTimestamp={setTimestamp} />
                </TableCell>
            </TableRow>
          )) : (<TableShimmer columns={limitCommands ? 3 : 4} endAction />)}
        </TableBody>
      </Table>
      <CollectionFab editPath="/settings/speedhunt" />
    </PageLayout>;
}

export default SpeedhuntsPage;