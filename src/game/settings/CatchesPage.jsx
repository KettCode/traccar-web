import { useReducer, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useAsyncTask } from '../../reactHelper';
import { useTranslation } from '../../common/components/LocalizationProvider';
import PageLayout from '../../common/components/PageLayout';
import GameMaintenanceMenu from './common/GameMaintenanceMenu';
import CollectionFab from '../../settings/components/CollectionFab';
import CollectionActions from '../../settings/components/CollectionActions';
import TableShimmer from '../../common/components/TableShimmer';
import { formatTime } from '../../common/util/formatter';
import useSettingsStyles from '../../settings/common/useSettingsStyles';
import fetchOrThrow from '../../common/util/fetchOrThrow';
import useGameLookupLabels from './common/useGameLookupLabels';

const CatchesPage = () => {
  const { classes } = useSettingsStyles();
  const t = useTranslation();
  const statusLabels = useGameLookupLabels('catchStatuses');

  const [reloadKey, reload] = useReducer((k) => k + 1, 0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useAsyncTask(
    async ({ signal }) => {
      void reloadKey;
      setLoading(true);
      const response = await fetchOrThrow('/api/catches', { signal });
      setItems(await response.json());
      setLoading(false);
    },
    [reloadKey],
  );

  return (
    <PageLayout menu={<GameMaintenanceMenu />} breadcrumbs={['settingsTitle', 'gameCatches']}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>{t('sharedId')}</TableCell>
            <TableCell>{t('gameGame')}</TableCell>
            <TableCell>{t('gameCaughtMember')}</TableCell>
            <TableCell>{t('gameStatus')}</TableCell>
            <TableCell>{t('gameCaughtAt')}</TableCell>
            <TableCell>{t('gameRevertedAt')}</TableCell>
            <TableCell className={classes.columnAction} />
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.gameId}</TableCell>
              <TableCell>{item.caughtMemberId}</TableCell>
              <TableCell>{statusLabels[item.status] || item.status}</TableCell>
              <TableCell>{formatTime(item.caughtAt, 'minutes')}</TableCell>
              <TableCell>{formatTime(item.revertedAt, 'minutes')}</TableCell>
              <TableCell className={classes.columnAction} padding="none">
                <CollectionActions
                  itemId={item.id}
                  editPath="/settings/game-catch"
                  endpoint="catches"
                  onReload={reload}
                />
              </TableCell>
            </TableRow>
          ))}
          {loading && <TableShimmer columns={7} endAction />}
        </TableBody>
      </Table>
      <CollectionFab editPath="/settings/game-catch" />
    </PageLayout>
  );
};

export default CatchesPage;
