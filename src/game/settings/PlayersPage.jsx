import { useReducer, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useAsyncTask } from '../../reactHelper';
import { useTranslation } from '../../common/components/LocalizationProvider';
import PageLayout from '../../common/components/PageLayout';
import GameMaintenanceMenu from './common/GameMaintenanceMenu';
import CollectionFab from '../../settings/components/CollectionFab';
import CollectionActions from '../../settings/components/CollectionActions';
import TableShimmer from '../../common/components/TableShimmer';
import { formatBoolean, formatTime } from '../../common/util/formatter';
import useSettingsStyles from '../../settings/common/useSettingsStyles';
import fetchOrThrow from '../../common/util/fetchOrThrow';

const PlayersPage = () => {
  const { classes } = useSettingsStyles();
  const t = useTranslation();

  const [reloadKey, reload] = useReducer((k) => k + 1, 0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useAsyncTask(
    async ({ signal }) => {
      void reloadKey;
      setLoading(true);
      const response = await fetchOrThrow('/api/players', { signal });
      setItems(await response.json());
      setLoading(false);
    },
    [reloadKey],
  );

  return (
    <PageLayout menu={<GameMaintenanceMenu />} breadcrumbs={['settingsTitle', 'gamePlayers']}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>{t('sharedId')}</TableCell>
            <TableCell>{t('sharedName')}</TableCell>
            <TableCell>{t('settingsUser')}</TableCell>
            <TableCell>{t('sharedDevice')}</TableCell>
            <TableCell>{t('sharedActive')}</TableCell>
            <TableCell>{t('gameCreatedAt')}</TableCell>
            <TableCell>{t('gameUpdatedAt')}</TableCell>
            <TableCell className={classes.columnAction} />
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.userId}</TableCell>
              <TableCell>{item.deviceId}</TableCell>
              <TableCell>{formatBoolean(item.active, t)}</TableCell>
              <TableCell>{formatTime(item.createdAt, 'minutes')}</TableCell>
              <TableCell>{formatTime(item.updatedAt, 'minutes')}</TableCell>
              <TableCell className={classes.columnAction} padding="none">
                <CollectionActions
                  itemId={item.id}
                  editPath="/settings/game-player"
                  endpoint="players"
                  onReload={reload}
                />
              </TableCell>
            </TableRow>
          ))}
          {loading && <TableShimmer columns={8} endAction />}
        </TableBody>
      </Table>
      <CollectionFab editPath="/settings/game-player" />
    </PageLayout>
  );
};

export default PlayersPage;
