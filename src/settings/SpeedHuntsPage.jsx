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
import { useRestriction } from '../common/util/permissions';
import useSettingsStyles from './common/useSettingsStyles';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

const SpeedHuntsPage = () => {
const classes = useSettingsStyles();
  const t = useTranslation();

  const devices = useSelector((state) => state.devices.items);
  const groups = useSelector((state) => state.groups.items);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [items, setItems] = useState([]);
  const [requestItems, setRequestItems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const limitCommands = useRestriction('limitCommands');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffectAsync(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/speedHunts?all=true');
      if (response.ok) {
        setItems(await response.json());
      } else {
        throw Error(await response.text());
      }

      const responseRequests = await fetch('/api/speedHuntRequests?all=true');
      if (responseRequests.ok) {
        setRequestItems(await responseRequests.json());
      } else {
        throw Error(await responseRequests.text());
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
            <TableCell>{'Id'}</TableCell>
            <TableCell>{'Manhuntid'}</TableCell>
            <TableCell>{'Anfragesteller (Gruppe)'}</TableCell>
            <TableCell>{'Zielgerät'}</TableCell>
            <TableCell>{'Anfragenummer'}</TableCell>
            <TableCell>{'Letzte Anfrage'}</TableCell>
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
              <TableCell>{item.pos}</TableCell>
              <TableCell>{dayjs.utc(item.lastTime).local().format('DD.MM.YYYY HH:mm')}</TableCell>
              <TableCell className={classes.columnAction} padding="none">
                  <CollectionActions itemId={item.id} editPath="/settings/speedHunt" endpoint="speedHunts" setTimestamp={setTimestamp} />
              </TableCell>
            </TableRow>
          )) : (<TableShimmer columns={limitCommands ? 3 : 4} endAction />)}
        </TableBody>
      </Table>
      <Fab
          size="medium" 
          color="primary"
          onClick={() => {
            navigate("/settings/speedHunt")
          }}
          style={{
            alignSelf: "end",
            margin: "1rem"
          }}
      >
          <AddIcon />
      </Fab>
      
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>{'Id'}</TableCell>
            <TableCell>{'Speedhuntid'}</TableCell>
            <TableCell>{'Anfragesteller (Benutzer)'}</TableCell>
            <TableCell>{'Anfragenummer'}</TableCell>
            <TableCell>{'Angefragt am'}</TableCell>
            <TableCell className={classes.columnAction} />
          </TableRow>
        </TableHead>
        <TableBody>
          {!loading ? requestItems.filter(filterByKeyword(searchKeyword)).map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.speedHuntsId}</TableCell>
              <TableCell>{item.userId ? users.find(x => x.id ==item.userId)?.name : null}</TableCell>
              <TableCell>{item.pos}</TableCell>
              <TableCell>{dayjs.utc(item.time).local().format('DD.MM.YYYY HH:mm')}</TableCell>
              <TableCell className={classes.columnAction} padding="none">
                  <CollectionActions itemId={item.id} editPath="/settings/speedHuntRequest" endpoint="speedHuntRequests" setTimestamp={setTimestamp} />
                </TableCell>
            </TableRow>
          )) : (<TableShimmer columns={limitCommands ? 3 : 4} endAction />)}
        </TableBody>
      </Table>
      <Fab
          size="medium" 
          color="primary"
          onClick={() => {
            navigate("/settings/speedHuntRequest")
          }}
          style={{
            alignSelf: "end",
            margin: "1rem"
          }}
        >
          <AddIcon />
        </Fab>
    </PageLayout>;
}

export default SpeedHuntsPage;