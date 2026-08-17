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
  jokerTitle,
  memberTitle,
  speedhuntTitle,
  toDateTimeInput,
} from './common/gameSettingsFormatters';
import useGameLookupLabels from './common/useGameLookupLabels';

const defaultItem = {
  gameId: 0,
  memberId: 0,
  jokerId: 0,
  type: 'hunter_locations',
  speedhuntId: 0,
  payload: '',
};

const RevealPage = () => {
  const { classes } = useSettingsStyles();
  const t = useTranslation();
  const jokerTypeLabels = useGameLookupLabels('jokerTypes');

  const [item, setItem] = useState();

  const validate = () => item && item.gameId > 0 && item.memberId > 0 && item.type;

  return (
    <EditItemView
      endpoint="reveals"
      item={item}
      setItem={setItem}
      defaultItem={defaultItem}
      validate={validate}
      menu={<GameMaintenanceMenu />}
      breadcrumbs={['settingsTitle', 'gameReveal']}
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
                lookup="revealTypes"
                value={item.type || null}
                onChange={(event) => setItem({ ...item, type: event.target.value })}
                label={t('sharedType')}
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
                value={item.speedhuntId || 0}
                emptyValue={0}
                onChange={(event) => setItem({ ...item, speedhuntId: Number(event.target.value) })}
                endpoint="/api/speedhunts"
                titleGetter={speedhuntTitle}
                label={t('gameSpeedhunt')}
              />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">{t('gameDetails')}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
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
                value={toDateTimeInput(item.revealedAt)}
                onChange={(event) =>
                  setItem({ ...item, revealedAt: fromDateTimeInput(event.target.value) })
                }
                label={t('gameRevealedAt')}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                type="datetime-local"
                value={toDateTimeInput(item.invalidatedAt)}
                onChange={(event) =>
                  setItem({ ...item, invalidatedAt: fromDateTimeInput(event.target.value) })
                }
                label={t('gameInvalidatedAt')}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </EditItemView>
  );
};

export default RevealPage;
