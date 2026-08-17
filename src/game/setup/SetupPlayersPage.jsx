import { useReducer, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import { useAsyncTask, useCatch } from '../../reactHelper';
import { useTranslation } from '../../common/components/LocalizationProvider';
import PageLayout from '../../common/components/PageLayout';
import PasswordField from '../../common/components/PasswordField';
import CollectionActions from '../../settings/components/CollectionActions';
import TableShimmer from '../../common/components/TableShimmer';
import { formatBoolean } from '../../common/util/formatter';
import useSettingsStyles from '../../settings/common/useSettingsStyles';
import fetchOrThrow from '../../common/util/fetchOrThrow';
import GameSetupMenu from './GameSetupMenu';

const SetupPlayersPage = () => {
  const { classes } = useSettingsStyles();
  const t = useTranslation();

  const [reloadKey, reload] = useReducer((k) => k + 1, 0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [passwordItem, setPasswordItem] = useState(null);
  const [password, setPassword] = useState('');

  useAsyncTask(
    async ({ signal }) => {
      void reloadKey;
      setLoading(true);
      const response = await fetchOrThrow('/api/setup/players', { signal });
      setItems(await response.json());
      setLoading(false);
    },
    [reloadKey],
  );

  const handleOpenPassword = (itemId) => {
    setPasswordItem(items.find((item) => item.playerId === itemId));
    setPassword('');
  };

  const handlePassword = useCatch(async () => {
    await fetchOrThrow(`/api/setup/players/${passwordItem.playerId}/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setPasswordItem(null);
  });

  return (
    <PageLayout menu={<GameSetupMenu />} breadcrumbs={['gameSetup', 'gamePlayer']}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>{t('sharedName')}</TableCell>
            <TableCell>{t('settingsUser')}</TableCell>
            <TableCell>{t('sharedDevice')}</TableCell>
            <TableCell>{t('sharedActive')}</TableCell>
            <TableCell className={classes.columnAction} />
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.playerId}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.userDisplayName || item.userLogin || item.userId}</TableCell>
              <TableCell>{item.deviceName || item.deviceUniqueId || item.deviceId}</TableCell>
              <TableCell>{formatBoolean(item.active, t)}</TableCell>
              <TableCell className={classes.columnAction} padding="none">
                <CollectionActions
                  itemId={item.playerId}
                  endpoint="setup/players"
                  onReload={reload}
                  customActions={[
                    {
                      key: 'password',
                      title: t('userPassword'),
                      icon: <KeyIcon fontSize="small" />,
                      handler: handleOpenPassword,
                    },
                  ]}
                />
              </TableCell>
            </TableRow>
          ))}
          {loading && <TableShimmer columns={5} endAction />}
        </TableBody>
      </Table>
      <Dialog open={!!passwordItem} onClose={() => setPasswordItem(null)} fullWidth maxWidth="xs">
        <DialogContent className={classes.details}>
          <PasswordField
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            label={t('userPassword')}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordItem(null)}>{t('sharedCancel')}</Button>
          <Button color="primary" variant="contained" onClick={handlePassword} disabled={!password}>
            {t('sharedSave')}
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
};

export default SetupPlayersPage;
