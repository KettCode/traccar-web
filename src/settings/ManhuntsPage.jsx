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

const ManhuntsPage = () => {
const classes = useSettingsStyles();
  const t = useTranslation();

  const groups = useSelector((state) => state.groups.items);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [items, setItems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const limitCommands = useRestriction('limitCommands');

  useEffectAsync(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/manhunts?all=true');
      if (response.ok) {
        setItems(await response.json());
      } else {
        throw Error(await response.text());
      }
    } finally {
      setLoading(false);
    }
  }, [timestamp]);

    return  <PageLayout menu={<SettingsMenu />} breadcrumbs={['settingsTitle', 'sharedSavedCommands']}>
      <SearchHeader keyword={searchKeyword} setKeyword={setSearchKeyword} />
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>{'Id'}</TableCell>
            <TableCell>{'Gruppe'}</TableCell>
            <TableCell>{'Start'}</TableCell>
            <TableCell>{'Frequenz'}</TableCell>
            <TableCell>{'Speedhunt limit'}</TableCell>
            <TableCell>{'Speedhunt anfragen'}</TableCell>
            <TableCell className={classes.columnAction} />
          </TableRow>
        </TableHead>
        <TableBody>
          {!loading ? items.filter(filterByKeyword(searchKeyword)).map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.groupId ? groups[item.groupId]?.name : null}</TableCell>
              <TableCell>{dayjs.utc(item.start).local().format('DD.MM.YYYY HH:mm')}</TableCell>
              <TableCell>{item.frequency}</TableCell>
              <TableCell>{item.speedHuntLimit}</TableCell>
              <TableCell>{item.speedHuntRequests}</TableCell>
              <TableCell className={classes.columnAction} padding="none">
                  <CollectionActions itemId={item.id} editPath="/settings/manhunt" endpoint="manhunts" setTimestamp={setTimestamp} />
                </TableCell>
            </TableRow>
          )) : (<TableShimmer columns={limitCommands ? 3 : 4} endAction />)}
        </TableBody>
      </Table>
      <CollectionFab editPath="/settings/manhunt" />
    </PageLayout>;
}

export default ManhuntsPage;