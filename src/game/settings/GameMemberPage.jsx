import { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from '../../common/components/LocalizationProvider';
import SelectField from '../../common/components/SelectField';
import EditItemView from '../../settings/components/EditItemView';
import SettingsMenu from '../../settings/components/SettingsMenu';
import useSettingsStyles from '../../settings/common/useSettingsStyles';
import GameLookupSelectField from './common/GameLookupSelectField';
import { fromDateTimeInput, toDateTimeInput, toNumber } from './common/gameSettingsFormatters';

const defaultItem = {
  gameId: 0,
  playerId: 0,
  role: 'hunted',
  status: 'active',
  displayName: '',
  canStartSpeedhunt: false,
  canRequestSpeedhuntPing: false,
};

const GameMemberPage = () => {
  const { classes } = useSettingsStyles();
  const t = useTranslation();

  const [item, setItem] = useState();

  const validate = () => item && item.gameId > 0 && item.playerId > 0 && item.role && item.status;

  return (
    <EditItemView
      endpoint="members"
      item={item}
      setItem={setItem}
      defaultItem={defaultItem}
      validate={validate}
      menu={<SettingsMenu />}
      breadcrumbs={['settingsTitle', 'gameMember']}
    >
      {item && (
        <>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">{t('sharedRequired')}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <SelectField
                value={item.gameId || 0}
                emptyValue={0}
                onChange={(event) => setItem({ ...item, gameId: Number(event.target.value) })}
                endpoint="/api/games?all=true"
                label={t('gameGame')}
              />
              <SelectField
                value={item.playerId || 0}
                emptyValue={0}
                onChange={(event) => setItem({ ...item, playerId: Number(event.target.value) })}
                endpoint="/api/players"
                titleGetter={(item) => item.name}
                label={t('gamePlayer')}
              />
              <GameLookupSelectField
                lookup="memberRoles"
                value={item.role || null}
                onChange={(event) => setItem({ ...item, role: event.target.value })}
                label={t('gameRole')}
              />
              <GameLookupSelectField
                lookup="memberStatuses"
                value={item.status || null}
                onChange={(event) => setItem({ ...item, status: event.target.value })}
                label={t('gameStatus')}
              />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">{t('gameDetails')}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <TextField
                value={item.displayName || ''}
                onChange={(event) => setItem({ ...item, displayName: event.target.value })}
                label={t('sharedName')}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={!!item.canStartSpeedhunt}
                    onChange={(event) =>
                      setItem({ ...item, canStartSpeedhunt: event.target.checked })
                    }
                  />
                }
                label={t('gameCanStartSpeedhunt')}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={!!item.canRequestSpeedhuntPing}
                    onChange={(event) =>
                      setItem({ ...item, canRequestSpeedhuntPing: event.target.checked })
                    }
                  />
                }
                label={t('gameCanRequestSpeedhuntPing')}
              />
              <TextField
                type="number"
                value={item.lastVisiblePingId || 0}
                onChange={(event) =>
                  setItem({ ...item, lastVisiblePingId: toNumber(event.target.value) })
                }
                label={t('gameLastVisiblePingId')}
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
                value={toDateTimeInput(item.caughtAt)}
                onChange={(event) =>
                  setItem({ ...item, caughtAt: fromDateTimeInput(event.target.value) })
                }
                label={t('gameCaughtAt')}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                type="datetime-local"
                value={toDateTimeInput(item.lastLocationReminderAt)}
                onChange={(event) =>
                  setItem({
                    ...item,
                    lastLocationReminderAt: fromDateTimeInput(event.target.value),
                  })
                }
                label={t('gameLastLocationReminderAt')}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </EditItemView>
  );
};

export default GameMemberPage;
