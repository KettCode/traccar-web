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
import {
  fromDateTimeInput,
  memberTitle,
  toDateTimeInput,
  toNumber,
  userTitle,
} from './common/gameSettingsFormatters';

const defaultItem = {
  gameId: 0,
  sequenceNumber: 0,
  targetMemberId: 0,
  createdByUserId: 0,
  maxPings: 0,
};

const SpeedhuntPage = () => {
  const { classes } = useSettingsStyles();
  const t = useTranslation();

  const [item, setItem] = useState();

  const validate = () => item && item.gameId > 0 && item.targetMemberId > 0;

  return (
    <EditItemView
      endpoint="speedhunts"
      item={item}
      setItem={setItem}
      defaultItem={defaultItem}
      validate={validate}
      menu={<GameMaintenanceMenu />}
      breadcrumbs={['settingsTitle', 'gameSpeedhunt']}
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
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">{t('gameDetails')}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <TextField
                type="number"
                value={item.sequenceNumber || 0}
                onChange={(event) =>
                  setItem({ ...item, sequenceNumber: toNumber(event.target.value) })
                }
                label={t('gameSequenceNumber')}
              />
              <SelectField
                value={item.createdByUserId || 0}
                emptyValue={0}
                onChange={(event) =>
                  setItem({ ...item, createdByUserId: Number(event.target.value) })
                }
                endpoint="/api/users?excludeAttributes=true"
                titleGetter={userTitle}
                label={t('gameCreatedByUserId')}
              />
              <TextField
                type="number"
                value={item.maxPings || 0}
                onChange={(event) => setItem({ ...item, maxPings: toNumber(event.target.value) })}
                label={t('gameMaxPings')}
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
                value={toDateTimeInput(item.startedAt)}
                onChange={(event) =>
                  setItem({ ...item, startedAt: fromDateTimeInput(event.target.value) })
                }
                label={t('gameStartedAt')}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                type="datetime-local"
                value={toDateTimeInput(item.endedAt)}
                onChange={(event) =>
                  setItem({ ...item, endedAt: fromDateTimeInput(event.target.value) })
                }
                label={t('gameEndedAt')}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </EditItemView>
  );
};

export default SpeedhuntPage;
