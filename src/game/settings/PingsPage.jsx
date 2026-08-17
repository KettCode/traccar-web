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
import useGameLookupLabels from './common/useGameLookupLabels';

const PingsPage = () => {
  const { classes } = useSettingsStyles();
  const t = useTranslation();
  const sourceLabels = useGameLookupLabels('pingSources');

  const [reloadKey, reload] = useReducer((k) => k + 1, 0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useAsyncTask(
    async ({ signal }) => {
      void reloadKey;
      setLoading(true);
      const response = await fetchOrThrow('/api/pings', { signal });
      setItems(await response.json());
      setLoading(false);
    },
    [reloadKey],
  );

  return (
    <PageLayout menu={<GameMaintenanceMenu />} breadcrumbs={['settingsTitle', 'gamePings']}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>{t('sharedId')}</TableCell>
            <TableCell>{t('gameGame')}</TableCell>
            <TableCell>{t('gameTargetMember')}</TableCell>
            <TableCell>{t('gameSource')}</TableCell>
            <TableCell>{t('gameSkipped')}</TableCell>
            <TableCell>{t('gameScheduledAt')}</TableCell>
            <TableCell>{t('gameCreatedAt')}</TableCell>
            <TableCell className={classes.columnAction} />
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.gameId}</TableCell>
              <TableCell>{item.targetMemberId}</TableCell>
              <TableCell>{sourceLabels[item.source] || item.source}</TableCell>
              <TableCell>{formatBoolean(item.skipped, t)}</TableCell>
              <TableCell>{formatTime(item.scheduledAt, 'minutes')}</TableCell>
              <TableCell>{formatTime(item.createdAt, 'minutes')}</TableCell>
              <TableCell className={classes.columnAction} padding="none">
                <CollectionActions
                  itemId={item.id}
                  editPath="/settings/game-ping"
                  endpoint="pings"
                  onReload={reload}
                />
              </TableCell>
            </TableRow>
          ))}
          {loading && <TableShimmer columns={8} endAction />}
        </TableBody>
      </Table>
      <CollectionFab editPath="/settings/game-ping" />
    </PageLayout>
  );
};

export default PingsPage;
