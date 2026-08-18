import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
} from '@mui/material';
import { useTranslation } from '../../../common/components/LocalizationProvider';
import PasswordField from '../../../common/components/PasswordField';
import SelectField from '../../../common/components/SelectField';
import { getPlayerTitle } from './setupWizardUtils';

const SetupMemberDialog = ({ wizard }) => {
  const t = useTranslation();
  const open = !!wizard.memberMode;
  const existing = wizard.memberMode === 'existing';
  const editing = wizard.memberMode === 'edit';
  const hunter = wizard.member.role === 'hunter';
  const title = editing
    ? t('sharedEdit')
    : existing
      ? t('gameSetupExistingPlayer')
      : t('gameSetupNewPlayer');

  return (
    <Dialog open={open} onClose={wizard.closeMemberDialog} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {existing && (
            <SelectField
              endpoint={`/api/setup/games/${wizard.gameId}/members/availablePlayers`}
              value={wizard.member.playerId || 0}
              emptyValue={0}
              keyGetter={(item) => item.playerId}
              titleGetter={getPlayerTitle}
              onChange={(event) =>
                wizard.setMember({ ...wizard.member, playerId: Number(event.target.value) })
              }
              label={t('gamePlayer')}
              fullWidth
            />
          )}
          {!editing && !existing && (
            <TextField
              value={wizard.member.username}
              onChange={(event) =>
                wizard.setMember({ ...wizard.member, username: event.target.value })
              }
              label={t('gameSetupUsername')}
              fullWidth
            />
          )}
          <TextField
            value={wizard.member.displayName}
            onChange={(event) =>
              wizard.setMember({ ...wizard.member, displayName: event.target.value })
            }
            label={t('sharedName')}
            fullWidth
          />
          <SelectField
            data={wizard.state?.availableRoles || []}
            keyGetter={(item) => item.value}
            titleGetter={(item) => item.label}
            value={wizard.member.role}
            onChange={(event) => {
              const role = event.target.value;
              wizard.setMember({
                ...wizard.member,
                role,
                canStartSpeedhunt: role === 'hunter' && wizard.member.canStartSpeedhunt,
                canRequestSpeedhuntPing: role === 'hunter' && wizard.member.canRequestSpeedhuntPing,
              });
            }}
            label={t('gameRole')}
            fullWidth
          />
          <FormControlLabel
            control={
              <Switch
                checked={hunter && !!wizard.member.canStartSpeedhunt}
                disabled={!hunter}
                onChange={(event) =>
                  wizard.setMember({
                    ...wizard.member,
                    canStartSpeedhunt: event.target.checked,
                  })
                }
              />
            }
            label={t('gameCanStartSpeedhunt')}
          />
          <FormControlLabel
            control={
              <Switch
                checked={hunter && !!wizard.member.canRequestSpeedhuntPing}
                disabled={!hunter}
                onChange={(event) =>
                  wizard.setMember({
                    ...wizard.member,
                    canRequestSpeedhuntPing: event.target.checked,
                  })
                }
              />
            }
            label={t('gameCanRequestSpeedhuntPing')}
          />
          {!editing && !existing && (
            <PasswordField
              value={wizard.member.password}
              onChange={(event) =>
                wizard.setMember({ ...wizard.member, password: event.target.value })
              }
              label={t('userPassword')}
              fullWidth
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={wizard.closeMemberDialog}>{t('sharedCancel')}</Button>
        <Button variant="contained" onClick={wizard.saveMember} disabled={!isValid(wizard)}>
          {t('sharedSave')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const isValid = (wizard) => {
  if (!wizard.member.displayName || !wizard.member.role) {
    return false;
  }
  if (wizard.memberMode === 'existing') {
    return !!wizard.member.playerId;
  }
  if (wizard.memberMode === 'new') {
    return !!wizard.member.username && !!wizard.member.password;
  }
  return true;
};

export default SetupMemberDialog;
