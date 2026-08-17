import { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
  memberTitle,
  toDateTimeInput,
  userTitle,
} from './common/gameSettingsFormatters';

const defaultItem = {
  gameId: 0,
  memberId: 0,
  type: 'skip_ping',
  status: 'unlocked',
  unlockedByUserId: 0,
};

const JokerPage = () => {
  const { classes } = useSettingsStyles();
  const t = useTranslation();

  const [item, setItem] = useState();

  const validate = () => item && item.gameId > 0 && item.memberId > 0 && item.type && item.status;

  return (
    <EditItemView
      endpoint="jokers"
      item={item}
      setItem={setItem}
      defaultItem={defaultItem}
      validate={validate}
      menu={<GameMaintenanceMenu />}
      breadcrumbs={['settingsTitle', 'gameJoker']}
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
                lookup="jokerTypes"
                value={item.type || null}
                onChange={(event) => setItem({ ...item, type: event.target.value })}
                label={t('sharedType')}
              />
              <GameLookupSelectField
                lookup="jokerStatuses"
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
              <SelectField
                value={item.unlockedByUserId || 0}
                emptyValue={0}
                onChange={(event) =>
                  setItem({ ...item, unlockedByUserId: Number(event.target.value) })
                }
                endpoint="/api/users?excludeAttributes=true"
                titleGetter={userTitle}
                label={t('gameUnlockedByUserId')}
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
                value={toDateTimeInput(item.unlockedAt)}
                onChange={(event) =>
                  setItem({ ...item, unlockedAt: fromDateTimeInput(event.target.value) })
                }
                label={t('gameUnlockedAt')}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                type="datetime-local"
                value={toDateTimeInput(item.activatedAt)}
                onChange={(event) =>
                  setItem({ ...item, activatedAt: fromDateTimeInput(event.target.value) })
                }
                label={t('gameActivatedAt')}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                type="datetime-local"
                value={toDateTimeInput(item.usedAt)}
                onChange={(event) =>
                  setItem({ ...item, usedAt: fromDateTimeInput(event.target.value) })
                }
                label={t('gameUsedAt')}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                type="datetime-local"
                value={toDateTimeInput(item.cancelledAt)}
                onChange={(event) =>
                  setItem({ ...item, cancelledAt: fromDateTimeInput(event.target.value) })
                }
                label={t('gameCancelledAt')}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </EditItemView>
  );
};

export default JokerPage;
