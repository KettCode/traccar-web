import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import EditIcon from '@mui/icons-material/Edit';
import QrCodeIcon from '@mui/icons-material/QrCode';
import CollectionActions from '../../../settings/components/CollectionActions';
import { useTranslation } from '../../../common/components/LocalizationProvider';
import GameClientSetupDialog from '../../common/GameClientSetupDialog';
import { formatGameMemberStatus } from '../../common/gameFormatters';
import { memberStatusColor } from '../../runtime/components/gameRuntimeUi';
import { getLookupLabel } from './setupWizardUtils';

const SetupPlayersStep = ({ wizard }) => {
  const t = useTranslation();
  const members = wizard.state?.members || [];
  const [linkItem, setLinkItem] = useState(null);

  const openLink = (memberId) => {
    setLinkItem(members.find((item) => item.memberId === memberId));
  };

  const memberActions = (item) => (
    <CollectionActions
      itemId={item.memberId}
      endpoint={`setup/games/${wizard.gameId}/members`}
      onReload={wizard.reload}
      readonly={!wizard.editable}
      customActions={[
        ...(item.clientSetupLink
          ? [
              {
                key: 'setupLink',
                title: t('sharedQrCode'),
                icon: <QrCodeIcon fontSize="small" />,
                handler: openLink,
              },
            ]
          : []),
        ...(wizard.editable
          ? [
              {
                key: 'edit',
                title: t('sharedEdit'),
                icon: <EditIcon fontSize="small" />,
                handler: wizard.openEditMember,
              },
            ]
          : []),
      ]}
    />
  );

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h6">{t('gamePlayer')}</Typography>
        <Typography variant="body2" color="text.secondary">
          {t('gameSetupPlayersDescription')}
        </Typography>
      </Box>
      {!wizard.gameId && <Alert severity="info">{t('gameSetupSaveGameFirst')}</Alert>}
      {!!wizard.gameId && (
        <>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={wizard.openNewMember}
              disabled={!wizard.editable}
            >
              {t('gameSetupNewPlayer')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<GroupAddIcon />}
              onClick={wizard.openExistingMember}
              disabled={!wizard.editable}
            >
              {t('gameSetupExistingPlayer')}
            </Button>
          </Stack>
          {!members.length && <Alert severity="info">{t('gameSetupNoPlayers')}</Alert>}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
              gap: 1.5,
            }}
          >
            {members.map((item) => (
              <Card key={item.memberId} variant="outlined">
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" spacing={2}>
                    <Box>
                      <Typography variant="subtitle1">{item.displayName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.userDisplayName || item.userLogin || item.userId}
                      </Typography>
                    </Box>
                    <Stack
                      direction="row"
                      spacing={0.75}
                      flexWrap="wrap"
                      justifyContent="flex-end"
                      useFlexGap
                    >
                      <Chip
                        size="small"
                        label={getLookupLabel(wizard.state.availableRoles, item.role)}
                      />
                      {item.status && item.status !== 'active' && (
                        <Chip
                          size="small"
                          color={memberStatusColor(item.status)}
                          label={formatGameMemberStatus(t, item.status)}
                        />
                      )}
                    </Stack>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {item.deviceName || item.deviceUniqueId || item.deviceId}
                  </Typography>
                  {item.role === 'hunter' && (
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
                      {item.canStartSpeedhunt && (
                        <Chip size="small" color="primary" label={t('gameCanStartSpeedhunt')} />
                      )}
                      {item.canRequestSpeedhuntPing && (
                        <Chip
                          size="small"
                          color="primary"
                          label={t('gameCanRequestSpeedhuntPing')}
                        />
                      )}
                    </Stack>
                  )}
                </CardContent>
                <CardActions>{memberActions(item)}</CardActions>
              </Card>
            ))}
          </Box>
        </>
      )}
      <GameClientSetupDialog item={linkItem} onClose={() => setLinkItem(null)} />
    </Stack>
  );
};

export default SetupPlayersStep;
