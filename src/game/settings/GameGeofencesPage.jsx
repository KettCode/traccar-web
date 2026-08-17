import { useReducer, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useAsyncTask } from '../../reactHelper';
import { useTranslation } from '../../common/components/LocalizationProvider';
import PageLayout from '../../common/components/PageLayout';
import GameMaintenanceMenu from './common/GameMaintenanceMenu';
import CollectionFab from '../../settings/components/CollectionFab';
import CollectionActions from '../../settings/components/CollectionActions';
import TableShimmer from '../../common/components/TableShimmer';
import { formatBoolean } from '../../common/util/formatter';
import useSettingsStyles from '../../settings/common/useSettingsStyles';
import fetchOrThrow from '../../common/util/fetchOrThrow';
import useGameLookupLabels from './common/useGameLookupLabels';

const GameGeofencesPage = () => {
  const { classes } = useSettingsStyles();
  const t = useTranslation();
  const typeLabels = useGameLookupLabels('geofenceTypes');
  const roleLabels = useGameLookupLabels('memberRoles');

  const [reloadKey, reload] = useReducer((k) => k + 1, 0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useAsyncTask(
    async ({ signal }) => {
      void reloadKey;
      setLoading(true);
      const response = await fetchOrThrow('/api/gameGeofences', { signal });
      setItems(await response.json());
      setLoading(false);
    },
    [reloadKey],
  );

  return (
    <PageLayout menu={<GameMaintenanceMenu />} breadcrumbs={['settingsTitle', 'gameGeofences']}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>{t('sharedId')}</TableCell>
            <TableCell>{t('gameGame')}</TableCell>
            <TableCell>{t('sharedGeofence')}</TableCell>
            <TableCell>{t('sharedName')}</TableCell>
            <TableCell>{t('sharedType')}</TableCell>
            <TableCell>{t('gameRole')}</TableCell>
            <TableCell>{t('sharedActive')}</TableCell>
            <TableCell className={classes.columnAction} />
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.gameId}</TableCell>
              <TableCell>{item.geofenceId}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{typeLabels[item.type] || item.type}</TableCell>
              <TableCell>{roleLabels[item.role] || item.role}</TableCell>
              <TableCell>{formatBoolean(item.active, t)}</TableCell>
              <TableCell className={classes.columnAction} padding="none">
                <CollectionActions
                  itemId={item.id}
                  editPath="/settings/game-geofence"
                  endpoint="gameGeofences"
                  onReload={reload}
                />
              </TableCell>
            </TableRow>
          ))}
          {loading && <TableShimmer columns={8} endAction />}
        </TableBody>
      </Table>
      <CollectionFab editPath="/settings/game-geofence" />
    </PageLayout>
  );
};

export default GameGeofencesPage;
