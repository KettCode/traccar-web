import {
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from '../../../common/components/LocalizationProvider';
import { fromDateTimeInput, toDateTimeInput, toNumber } from './setupWizardUtils';

const SetupGameStep = ({ wizard }) => {
  const t = useTranslation();
  const { game, setGame, saveGame } = wizard;
  const disabled = !wizard.editable;

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h6">{t('gameSetupGeneral')}</Typography>
        <Typography variant="body2" color="text.secondary">
          {t('gameSetupGeneralDescription')}
        </Typography>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        <TextField
          value={game.name || ''}
          onChange={(event) => setGame({ ...game, name: event.target.value })}
          label={t('sharedName')}
          disabled={disabled}
          fullWidth
        />
        <TextField
          type="datetime-local"
          value={toDateTimeInput(game.plannedEndAt)}
          onChange={(event) =>
            setGame({ ...game, plannedEndAt: fromDateTimeInput(event.target.value) })
          }
          label={t('gamePlannedEndAt')}
          disabled={disabled}
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          type="number"
          value={game.pingIntervalSeconds ?? 0}
          onChange={(event) =>
            setGame({ ...game, pingIntervalSeconds: toNumber(event.target.value) })
          }
          label={t('gamePingIntervalSeconds')}
          disabled={disabled}
          fullWidth
          slotProps={{ htmlInput: { min: 300 } }}
        />
        <TextField
          type="number"
          value={game.maxPositionAgeSeconds ?? 0}
          onChange={(event) =>
            setGame({ ...game, maxPositionAgeSeconds: toNumber(event.target.value) })
          }
          label={t('gameMaxPositionAgeSeconds')}
          disabled={disabled}
          fullWidth
          slotProps={{ htmlInput: { min: 60 } }}
        />
        <TextField
          type="number"
          value={game.speedhuntLimit ?? 0}
          onChange={(event) => setGame({ ...game, speedhuntLimit: toNumber(event.target.value) })}
          label={t('gameSpeedhuntLimit')}
          disabled={disabled}
          fullWidth
          slotProps={{ htmlInput: { min: 0 } }}
        />
        <TextField
          type="number"
          value={game.speedhuntPingLimit ?? 0}
          onChange={(event) =>
            setGame({ ...game, speedhuntPingLimit: toNumber(event.target.value) })
          }
          label={t('gameSpeedhuntPingLimit')}
          disabled={disabled}
          fullWidth
          slotProps={{ htmlInput: { min: 0 } }}
        />
        <TextField
          type="number"
          value={game.locationReminderIntervalSeconds ?? 0}
          onChange={(event) =>
            setGame({ ...game, locationReminderIntervalSeconds: toNumber(event.target.value) })
          }
          label={t('gameLocationReminderIntervalSeconds')}
          disabled={disabled}
          fullWidth
          slotProps={{ htmlInput: { min: 120 } }}
        />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        <Card variant="outlined">
          <CardContent>
            <FormControlLabel
              control={
                <Switch
                  checked={!!game.locationReminderEnabled}
                  disabled={disabled}
                  onChange={(event) =>
                    setGame({ ...game, locationReminderEnabled: event.target.checked })
                  }
                />
              }
              label={t('gameLocationReminderEnabled')}
            />
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent>
            <FormControlLabel
              control={
                <Switch
                  checked={!!game.allowConsecutiveSpeedhuntsSameTarget}
                  disabled={disabled}
                  onChange={(event) =>
                    setGame({ ...game, allowConsecutiveSpeedhuntsSameTarget: event.target.checked })
                  }
                />
              }
              label={t('gameAllowConsecutiveSpeedhuntsSameTarget')}
            />
          </CardContent>
        </Card>
      </Box>
      <Box>
        <Button variant="outlined" onClick={saveGame} disabled={!game.name || !wizard.editable}>
          {t('sharedSave')}
        </Button>
      </Box>
    </Stack>
  );
};

export default SetupGameStep;
