import { useCallback, useReducer, useState } from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { useAsyncTask, useCatch, useScrollToLoad, pageSize } from '../../reactHelper';
import { useTranslation } from '../../common/components/LocalizationProvider';
import PageLayout from '../../common/components/PageLayout';
import CollectionActions from '../../settings/components/CollectionActions';
import CollectionFab from '../../settings/components/CollectionFab';
import TableShimmer from '../../common/components/TableShimmer';
import SearchHeader from '../../settings/components/SearchHeader';
import { formatTime } from '../../common/util/formatter';
import useSettingsStyles from '../../settings/common/useSettingsStyles';
import fetchOrThrow from '../../common/util/fetchOrThrow';
import GameStatusChip from '../common/GameStatusChip';
import useGameLookupLabels from '../settings/common/useGameLookupLabels';
import GameSetupMenu from './GameSetupMenu';

const SetupGamesPage = () => {
  const { classes } = useSettingsStyles();
  const navigate = useNavigate();
  const t = useTranslation();
  const statusLabels = useGameLookupLabels('gameStatuses');

  const [reloadKey, reload] = useReducer((k) => k + 1, 0);
  const [items, setItems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [copyItem, setCopyItem] = useState(null);
  const [copyRequest, setCopyRequest] = useState({
    name: '',
    copySettings: true,
    copyMembers: true,
    copyGeofences: true,
  });

  const loadItems = useCallback(
    async (offset, signal) => {
      const response = await fetchOrThrow('/api/setup/games', { signal });
      const data = await response.json();
      const filtered = searchKeyword
        ? data.filter((item) => item.name?.toLowerCase().includes(searchKeyword.toLowerCase()))
        : data;
      setItems((previous) =>
        offset
          ? [...previous, ...filtered.slice(offset, offset + pageSize)]
          : filtered.slice(0, pageSize),
      );
      setHasMore(filtered.length > offset + pageSize);
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

  const handleOpenCopy = (itemId) => {
    const item = items.find((current) => current.id === itemId);
    setCopyItem(item);
    setCopyRequest({
      name: item?.name ? `${item.name} Copy` : '',
      copySettings: true,
      copyMembers: true,
      copyGeofences: true,
    });
  };

  const handleCopy = useCatch(async () => {
    await fetchOrThrow(`/api/setup/games/${copyItem.id}/copy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(copyRequest),
    });
    setCopyItem(null);
    reload();
  });

  const handleFinish = useCatch(async (itemId) => {
    await fetchOrThrow(`/api/games/${itemId}/finish`, { method: 'POST' });
    reload();
  });

  return (
    <PageLayout menu={<GameSetupMenu />} breadcrumbs={['gameSetup', 'gameGame']}>
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
                  endpoint="setup/games"
                  onReload={reload}
                  readonly={item.status !== 'draft'}
                  customActions={[
                    ...(item.status === 'draft'
                      ? [
                          {
                            key: 'edit',
                            title: t('sharedEdit'),
                            icon: <EditIcon fontSize="small" />,
                            handler: (itemId) => navigate(`/game/setup/${itemId}/wizard`),
                          },
                        ]
                      : [
                          {
                            key: 'details',
                            title: t('sharedShowDetails'),
                            icon: <VisibilityIcon fontSize="small" />,
                            handler: (itemId) => navigate(`/game/setup/${itemId}/wizard`),
                          },
                        ]),
                    {
                      key: 'copy',
                      title: t('sharedCopy'),
                      icon: <ContentCopyIcon fontSize="small" />,
                      handler: handleOpenCopy,
                    },
                    ...(item.status === 'running'
                      ? [
                          {
                            key: 'finish',
                            title: t('gameFinish'),
                            icon: <StopCircleIcon fontSize="small" />,
                            handler: handleFinish,
                          },
                        ]
                      : []),
                  ]}
                />
              </TableCell>
            </TableRow>
          ))}
          {hasMore && (
            <TableShimmer ref={items.length > 0 ? sentinelRef : null} columns={6} endAction />
          )}
        </TableBody>
      </Table>
      <CollectionFab editPath="/game/setup/wizard" />
      <Dialog open={!!copyItem} onClose={() => setCopyItem(null)} fullWidth maxWidth="xs">
        <DialogContent className={classes.details}>
          <TextField
            value={copyRequest.name}
            onChange={(event) => setCopyRequest({ ...copyRequest, name: event.target.value })}
            label={t('sharedName')}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={copyRequest.copySettings}
                onChange={(event) =>
                  setCopyRequest({ ...copyRequest, copySettings: event.target.checked })
                }
              />
            }
            label={t('gameCopySettings')}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={copyRequest.copyMembers}
                onChange={(event) =>
                  setCopyRequest({ ...copyRequest, copyMembers: event.target.checked })
                }
              />
            }
            label={t('gameCopyPlayers')}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={copyRequest.copyGeofences}
                onChange={(event) =>
                  setCopyRequest({ ...copyRequest, copyGeofences: event.target.checked })
                }
              />
            }
            label={t('gameCopyGeofences')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCopyItem(null)}>{t('sharedCancel')}</Button>
          <Button
            color="primary"
            variant="contained"
            onClick={handleCopy}
            disabled={!copyRequest.name}
          >
            {t('sharedCopy')}
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
};

export default SetupGamesPage;
