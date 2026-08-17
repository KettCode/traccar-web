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
import GameMaintenanceMenu from './common/GameMaintenanceMenu';
import useSettingsStyles from '../../settings/common/useSettingsStyles';
import GameLookupSelectField from './common/GameLookupSelectField';
import {
  fromDateTimeInput,
  jokerTitle,
  memberTitle,
  pingTitle,
  toDateTimeInput,
} from './common/gameSettingsFormatters';
import useGameLookupLabels from './common/useGameLookupLabels';

const defaultItem = {
  gameId: 0,
  memberId: 0,
  jokerId: 0,
  effect: 'skip_next_ping',
  active: true,
  payload: '',
  consumedPingId: 0,
};

const PendingEffectPage = () => {
  const { classes } = useSettingsStyles();
  const t = useTranslation();
  const jokerTypeLabels = useGameLookupLabels('jokerTypes');
  const pingSourceLabels = useGameLookupLabels('pingSources');

  const [item, setItem] = useState();

  const validate = () => item && item.gameId > 0 && item.memberId > 0 && item.effect;

  return (
    <EditItemView
      endpoint="pendingEffects"
      item={item}
      setItem={setItem}
      defaultItem={defaultItem}
      validate={validate}
      menu={<GameMaintenanceMenu />}
      breadcrumbs={['settingsTitle', 'gamePendingEffect']}
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
                value={item.memberId || 0}
                emptyValue={0}
                onChange={(event) => setItem({ ...item, memberId: Number(event.target.value) })}
                endpoint="/api/members"
                titleGetter={memberTitle}
                label={t('gameMember')}
              />
              <GameLookupSelectField
                lookup="pendingEffectTypes"
                value={item.effect || null}
                onChange={(event) => setItem({ ...item, effect: event.target.value })}
                label={t('gameEffect')}
              />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">{t('gameRelations')}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <SelectField
                value={item.jokerId || 0}
                emptyValue={0}
                onChange={(event) => setItem({ ...item, jokerId: Number(event.target.value) })}
                endpoint="/api/jokers"
                titleGetter={(option) => jokerTitle(option, jokerTypeLabels)}
                label={t('gameJoker')}
              />
              <SelectField
                value={item.consumedPingId || 0}
                emptyValue={0}
                onChange={(event) =>
                  setItem({ ...item, consumedPingId: Number(event.target.value) })
                }
                endpoint="/api/pings"
                titleGetter={(option) => pingTitle(option, pingSourceLabels)}
                label={t('gameConsumedPing')}
              />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">{t('gameDetails')}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <FormControlLabel
                control={
                  <Switch
                    checked={!!item.active}
                    onChange={(event) => setItem({ ...item, active: event.target.checked })}
                  />
                }
                label={t('sharedActive')}
              />
              <TextField
                multiline
                minRows={3}
                value={item.payload || ''}
                onChange={(event) => setItem({ ...item, payload: event.target.value })}
                label={t('gamePayload')}
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
                value={toDateTimeInput(item.createdAt)}
                onChange={(event) =>
                  setItem({ ...item, createdAt: fromDateTimeInput(event.target.value) })
                }
                label={t('gameCreatedAt')}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                type="datetime-local"
                value={toDateTimeInput(item.consumedAt)}
                onChange={(event) =>
                  setItem({ ...item, consumedAt: fromDateTimeInput(event.target.value) })
                }
                label={t('gameConsumedAt')}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </EditItemView>
  );
};

export default PendingEffectPage;
