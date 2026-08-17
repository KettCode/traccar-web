import { useState } from 'react';
import dayjs from 'dayjs';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  FormControlLabel,
  Switch,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from '../../common/components/LocalizationProvider';
import EditItemView from '../../settings/components/EditItemView';
import GameMaintenanceMenu from './common/GameMaintenanceMenu';
import useSettingsStyles from '../../settings/common/useSettingsStyles';
import GameLookupSelectField from './common/GameLookupSelectField';

const defaultItem = {
  name: '',
  status: 'draft',
  pingIntervalSeconds: 900,
  speedhuntLimit: 0,
  speedhuntPingLimit: 3,
  allowConsecutiveSpeedhuntsSameTarget: false,
  fakePingMaxDistanceMeters: 1000,
  locationReminderEnabled: true,
  maxPositionAgeSeconds: 120,
  locationReminderIntervalSeconds: 300,
};

const toNumber = (value) => (value === '' ? 0 : Number(value));

const toDateTimeInput = (value) => (value ? dayjs(value).format('YYYY-MM-DDTHH:mm') : '');

const fromDateTimeInput = (value) => (value ? dayjs(value).toISOString() : null);

const GamePage = () => {
  const { classes } = useSettingsStyles();
  const t = useTranslation();

  const [item, setItem] = useState();

  const validate = () => item && item.name && item.status;

  return (
    <EditItemView
      endpoint="games"
      item={item}
      setItem={setItem}
      defaultItem={defaultItem}
      validate={validate}
      menu={<GameMaintenanceMenu />}
      breadcrumbs={['settingsTitle', 'gameGame']}
    >
      {item && (
        <>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">{t('sharedRequired')}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <TextField
                value={item.name || ''}
                onChange={(event) => setItem({ ...item, name: event.target.value })}
                label={t('sharedName')}
              />
              <GameLookupSelectField
                lookup="gameStatuses"
                value={item.status || null}
                onChange={(event) => setItem({ ...item, status: event.target.value })}
                label={t('gameStatus')}
              />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">{t('gameRuntimeSettings')}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <TextField
                type="number"
                value={item.pingIntervalSeconds ?? 0}
                onChange={(event) =>
                  setItem({ ...item, pingIntervalSeconds: toNumber(event.target.value) })
                }
                label={t('gamePingIntervalSeconds')}
              />
              <TextField
                type="number"
                value={item.speedhuntLimit ?? 0}
                onChange={(event) =>
                  setItem({ ...item, speedhuntLimit: toNumber(event.target.value) })
                }
                label={t('gameSpeedhuntLimit')}
              />
              <TextField
                type="number"
                value={item.speedhuntPingLimit ?? 0}
                onChange={(event) =>
                  setItem({ ...item, speedhuntPingLimit: toNumber(event.target.value) })
                }
                label={t('gameSpeedhuntPingLimit')}
              />
              <TextField
                type="number"
                value={item.fakePingMaxDistanceMeters ?? 0}
                onChange={(event) =>
                  setItem({ ...item, fakePingMaxDistanceMeters: toNumber(event.target.value) })
                }
                label={t('gameFakePingMaxDistanceMeters')}
              />
              <TextField
                type="number"
                value={item.maxPositionAgeSeconds ?? 0}
                onChange={(event) =>
                  setItem({ ...item, maxPositionAgeSeconds: toNumber(event.target.value) })
                }
                label={t('gameMaxPositionAgeSeconds')}
              />
              <TextField
                type="number"
                value={item.locationReminderIntervalSeconds ?? 0}
                onChange={(event) =>
                  setItem({
                    ...item,
                    locationReminderIntervalSeconds: toNumber(event.target.value),
                  })
                }
                label={t('gameLocationReminderIntervalSeconds')}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={!!item.allowConsecutiveSpeedhuntsSameTarget}
                    onChange={(event) =>
                      setItem({
                        ...item,
                        allowConsecutiveSpeedhuntsSameTarget: event.target.checked,
                      })
                    }
                  />
                }
                label={t('gameAllowConsecutiveSpeedhuntsSameTarget')}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={!!item.locationReminderEnabled}
                    onChange={(event) =>
                      setItem({ ...item, locationReminderEnabled: event.target.checked })
                    }
                  />
                }
                label={t('gameLocationReminderEnabled')}
              />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">{t('gameTimestamps')}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <TextField
                type="datetime-local"
                value={toDateTimeInput(item.plannedEndAt)}
                onChange={(event) =>
                  setItem({ ...item, plannedEndAt: fromDateTimeInput(event.target.value) })
                }
                label={t('gamePlannedEndAt')}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                type="datetime-local"
                value={toDateTimeInput(item.startedAt)}
                onChange={(event) =>
                  setItem({ ...item, startedAt: fromDateTimeInput(event.target.value) })
                }
                label={t('gameStartedAt')}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                type="datetime-local"
                value={toDateTimeInput(item.finishedAt)}
                onChange={(event) =>
                  setItem({ ...item, finishedAt: fromDateTimeInput(event.target.value) })
                }
                label={t('gameFinishedAt')}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </EditItemView>
  );
};

export default GamePage;
