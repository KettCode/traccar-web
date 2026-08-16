import { useReducer, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useAsyncTask } from '../../reactHelper';
import { useTranslation } from '../../common/components/LocalizationProvider';
import PageLayout from '../../common/components/PageLayout';
import SettingsMenu from '../../settings/components/SettingsMenu';
import CollectionFab from '../../settings/components/CollectionFab';
import CollectionActions from '../../settings/components/CollectionActions';
import TableShimmer from '../../common/components/TableShimmer';
import useSettingsStyles from '../../settings/common/useSettingsStyles';
import fetchOrThrow from '../../common/util/fetchOrThrow';
import useGameLookupLabels from './common/useGameLookupLabels';

const GameMembersPage = () => {
  const { classes } = useSettingsStyles();
  const t = useTranslation();
  const roleLabels = useGameLookupLabels('memberRoles');
  const statusLabels = useGameLookupLabels('memberStatuses');

  const [reloadKey, reload] = useReducer((k) => k + 1, 0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useAsyncTask(
    async ({ signal }) => {
      void reloadKey;
      setLoading(true);
      const response = await fetchOrThrow('/api/members', { signal });
      setItems(await response.json());
      setLoading(false);
    },
    [reloadKey],
  );

  return (
    <PageLayout menu={<SettingsMenu />} breadcrumbs={['settingsTitle', 'gameMembers']}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>{t('sharedId')}</TableCell>
            <TableCell>{t('gameGame')}</TableCell>
            <TableCell>{t('gamePlayer')}</TableCell>
            <TableCell>{t('sharedName')}</TableCell>
            <TableCell>{t('gameRole')}</TableCell>
            <TableCell>{t('gameStatus')}</TableCell>
            <TableCell className={classes.columnAction} />
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.gameId}</TableCell>
              <TableCell>{item.playerId}</TableCell>
              <TableCell>{item.displayName}</TableCell>
              <TableCell>{roleLabels[item.role] || item.role}</TableCell>
              <TableCell>{statusLabels[item.status] || item.status}</TableCell>
              <TableCell className={classes.columnAction} padding="none">
                <CollectionActions
                  itemId={item.id}
                  editPath="/settings/game-member"
                  endpoint="members"
                  onReload={reload}
                />
              </TableCell>
            </TableRow>
          ))}
          {loading && <TableShimmer columns={7} endAction />}
        </TableBody>
      </Table>
      <CollectionFab editPath="/settings/game-member" />
    </PageLayout>
  );
};

export default GameMembersPage;
