import { useCallback, useReducer, useState } from 'react';
import { Table, TableRow, TableCell, TableHead, TableBody } from '@mui/material';
import { useAsyncTask, useScrollToLoad, pageSize } from '../../reactHelper';
import { useTranslation } from '../../common/components/LocalizationProvider';
import PageLayout from '../../common/components/PageLayout';
import CollectionFab from '../../settings/components/CollectionFab';
import CollectionActions from '../../settings/components/CollectionActions';
import TableShimmer from '../../common/components/TableShimmer';
import SearchHeader from '../../settings/components/SearchHeader';
import { formatTime } from '../../common/util/formatter';
import useSettingsStyles from '../../settings/common/useSettingsStyles';
import GameMaintenanceMenu from './common/GameMaintenanceMenu';
import fetchOrThrow from '../../common/util/fetchOrThrow';
import GameStatusChip from '../common/GameStatusChip';
import useGameLookupLabels from './common/useGameLookupLabels';

const GamesPage = () => {
  const { classes } = useSettingsStyles();
  const t = useTranslation();
  const statusLabels = useGameLookupLabels('gameStatuses');

  const [reloadKey, reload] = useReducer((k) => k + 1, 0);
  const [items, setItems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [hasMore, setHasMore] = useState(true);

  const loadItems = useCallback(
    async (offset, signal) => {
      const query = new URLSearchParams({ all: true, limit: pageSize, offset });
      if (searchKeyword) {
        query.append('keyword', searchKeyword);
      }
      const response = await fetchOrThrow(`/api/games?${query.toString()}`, { signal });
      const data = await response.json();
      setItems((previous) => (offset ? [...previous, ...data] : data));
      setHasMore(data.length >= pageSize);
    },
    [searchKeyword],
  );

  const sentinelRef = useScrollToLoad(() => loadItems(items.length));

  useAsyncTask(
    async ({ signal }) => {
      void reloadKey;
      setItems([]);
      await loadItems(0, signal);
    },
    [reloadKey, loadItems],
  );

  return (
    <PageLayout menu={<GameMaintenanceMenu />} breadcrumbs={['settingsTitle', 'gameTitle']}>
      <SearchHeader keyword={searchKeyword} setKeyword={setSearchKeyword} />
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>{t('sharedName')}</TableCell>
            <TableCell>{t('gameStatus')}</TableCell>
            <TableCell>{t('gamePlannedEndAt')}</TableCell>
            <TableCell>{t('gameStartedAt')}</TableCell>
            <TableCell>{t('gameFinishedAt')}</TableCell>
            <TableCell className={classes.columnAction} />
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                <GameStatusChip status={item.status} label={statusLabels[item.status]} />
              </TableCell>
              <TableCell>{formatTime(item.plannedEndAt, 'minutes')}</TableCell>
              <TableCell>{formatTime(item.startedAt, 'minutes')}</TableCell>
              <TableCell>{formatTime(item.finishedAt, 'minutes')}</TableCell>
              <TableCell className={classes.columnAction} padding="none">
                <CollectionActions
                  itemId={item.id}
                  editPath="/settings/game"
                  endpoint="games"
                  onReload={reload}
                />
              </TableCell>
            </TableRow>
          ))}
          {hasMore && (
            <TableShimmer ref={items.length > 0 ? sentinelRef : null} columns={6} endAction />
          )}
        </TableBody>
      </Table>
      <CollectionFab editPath="/settings/game" />
    </PageLayout>
  );
};

export default GamesPage;
