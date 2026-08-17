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
import CollectionActions from '../../../settings/components/CollectionActions';
import { useTranslation } from '../../../common/components/LocalizationProvider';
import { getLookupLabel } from './setupWizardUtils';

const SetupPlayersStep = ({ wizard }) => {
  const t = useTranslation();
  const members = wizard.state?.members || [];

  const memberActions = (item) => (
    <CollectionActions
      itemId={item.memberId}
      endpoint={`setup/games/${wizard.gameId}/members`}
      onReload={wizard.reload}
      readonly={!wizard.editable}
      customActions={
        wizard.editable
          ? [
              {
                key: 'edit',
                title: t('sharedEdit'),
                icon: <EditIcon fontSize="small" />,
                handler: wizard.openEditMember,
              },
            ]
          : undefined
      }
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
                    <Chip
                      size="small"
                      label={getLookupLabel(wizard.state.availableRoles, item.role)}
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {item.deviceName || item.deviceUniqueId || item.deviceId}
                  </Typography>
                </CardContent>
                <CardActions>{memberActions(item)}</CardActions>
              </Card>
            ))}
          </Box>
        </>
      )}
    </Stack>
  );
};

export default SetupPlayersStep;
