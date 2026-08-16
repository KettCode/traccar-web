import { useReducer, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useAsyncTask } from '../../reactHelper';
import { useTranslation } from '../../common/components/LocalizationProvider';
import PageLayout from '../../common/components/PageLayout';
import SettingsMenu from '../../settings/components/SettingsMenu';
import CollectionFab from '../../settings/components/CollectionFab';
import CollectionActions from '../../settings/components/CollectionActions';
import TableShimmer from '../../common/components/TableShimmer';
import { formatTime } from '../../common/util/formatter';
import useSettingsStyles from '../../settings/common/useSettingsStyles';
import fetchOrThrow from '../../common/util/fetchOrThrow';

const SpeedhuntsPage = () => {
  const { classes } = useSettingsStyles();
  const t = useTranslation();

  const [reloadKey, reload] = useReducer((k) => k + 1, 0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useAsyncTask(
    async ({ signal }) => {
      void reloadKey;
      setLoading(true);
      const response = await fetchOrThrow('/api/speedhunts', { signal });
      setItems(await response.json());
      setLoading(false);
    },
    [reloadKey],
  );

  return (
    <PageLayout menu={<SettingsMenu />} breadcrumbs={['settingsTitle', 'gameSpeedhunts']}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>{t('sharedId')}</TableCell>
            <TableCell>{t('gameGame')}</TableCell>
            <TableCell>{t('gameSequenceNumber')}</TableCell>
            <TableCell>{t('gameTargetMember')}</TableCell>
            <TableCell>{t('gameMaxPings')}</TableCell>
            <TableCell>{t('gameStartedAt')}</TableCell>
            <TableCell>{t('gameEndedAt')}</TableCell>
            <TableCell className={classes.columnAction} />
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.gameId}</TableCell>
              <TableCell>{item.sequenceNumber}</TableCell>
              <TableCell>{item.targetMemberId}</TableCell>
              <TableCell>{item.maxPings}</TableCell>
              <TableCell>{formatTime(item.startedAt, 'minutes')}</TableCell>
              <TableCell>{formatTime(item.endedAt, 'minutes')}</TableCell>
              <TableCell className={classes.columnAction} padding="none">
                <CollectionActions
                  itemId={item.id}
                  editPath="/settings/game-speedhunt"
                  endpoint="speedhunts"
                  onReload={reload}
                />
              </TableCell>
            </TableRow>
          ))}
          {loading && <TableShimmer columns={8} endAction />}
        </TableBody>
      </Table>
      <CollectionFab editPath="/settings/game-speedhunt" />
    </PageLayout>
  );
};

export default SpeedhuntsPage;
