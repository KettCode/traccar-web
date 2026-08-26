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
  speedhuntTitle,
  toDateTimeInput,
  toNumber,
} from './common/gameSettingsFormatters';
import useGameLookupLabels from './common/useGameLookupLabels';

const defaultItem = {
  gameId: 0,
  targetMemberId: 0,
  source: 'regular',
  skipped: false,
  positionId: 0,
  latitude: 0,
  longitude: 0,
  accuracy: 0,
  speedhuntId: 0,
  sequenceNumber: 0,
  consumedJokerId: 0,
};

const PingPage = () => {
  const { classes } = useSettingsStyles();
  const t = useTranslation();
  const jokerTypeLabels = useGameLookupLabels('jokerTypes');

  const [item, setItem] = useState();

  const validate = () => item && item.gameId > 0 && item.targetMemberId > 0 && item.source;

  return (
    <EditItemView
      endpoint="pings"
      item={item}
      setItem={setItem}
      defaultItem={defaultItem}
      validate={validate}
      menu={<GameMaintenanceMenu />}
      breadcrumbs={['settingsTitle', 'gamePing']}
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
                value={item.targetMemberId || 0}
                emptyValue={0}
                onChange={(event) =>
                  setItem({ ...item, targetMemberId: Number(event.target.value) })
                }
                endpoint="/api/members"
                titleGetter={memberTitle}
                label={t('gameTargetMember')}
              />
              <GameLookupSelectField
                lookup="pingSources"
                value={item.source || null}
                onChange={(event) => setItem({ ...item, source: event.target.value })}
                label={t('gameSource')}
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
                    checked={!!item.skipped}
                    onChange={(event) => setItem({ ...item, skipped: event.target.checked })}
                  />
                }
                label={t('gameSkipped')}
              />
              <TextField
                type="number"
                value={item.positionId || 0}
                onChange={(event) => setItem({ ...item, positionId: toNumber(event.target.value) })}
                label={t('gamePositionId')}
              />
              <TextField
                type="number"
                value={item.latitude ?? 0}
                onChange={(event) => setItem({ ...item, latitude: toNumber(event.target.value) })}
                label={t('positionLatitude')}
              />
              <TextField
                type="number"
                value={item.longitude ?? 0}
                onChange={(event) => setItem({ ...item, longitude: toNumber(event.target.value) })}
                label={t('positionLongitude')}
              />
              <SelectField
                value={item.speedhuntId || 0}
                emptyValue={0}
                onChange={(event) => setItem({ ...item, speedhuntId: Number(event.target.value) })}
                endpoint="/api/speedhunts"
                titleGetter={speedhuntTitle}
                label={t('gameSpeedhunt')}
              />
              <TextField
                type="number"
                value={item.sequenceNumber || 0}
                onChange={(event) =>
                  setItem({ ...item, sequenceNumber: toNumber(event.target.value) })
                }
                label={t('gameSequenceNumber')}
              />
              <SelectField
                value={item.consumedJokerId || 0}
                emptyValue={0}
                onChange={(event) =>
                  setItem({ ...item, consumedJokerId: Number(event.target.value) })
                }
                endpoint="/api/jokers"
                titleGetter={(option) => jokerTitle(option, jokerTypeLabels)}
                label={t('gameConsumedJoker')}
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
                value={toDateTimeInput(item.fixTime)}
                onChange={(event) =>
                  setItem({ ...item, fixTime: fromDateTimeInput(event.target.value) })
                }
                label={t('positionFixTime')}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                type="datetime-local"
                value={toDateTimeInput(item.scheduledAt)}
                onChange={(event) =>
                  setItem({ ...item, scheduledAt: fromDateTimeInput(event.target.value) })
                }
                label={t('gameScheduledAt')}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                type="datetime-local"
                value={toDateTimeInput(item.createdAt)}
                onChange={(event) =>
                  setItem({ ...item, createdAt: fromDateTimeInput(event.target.value) })
                }
                label={t('gameCreatedAt')}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </EditItemView>
  );
};

export default PingPage;
