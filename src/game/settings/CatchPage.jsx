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
import SettingsMenu from '../../settings/components/SettingsMenu';
import useSettingsStyles from '../../settings/common/useSettingsStyles';
import GameLookupSelectField from './common/GameLookupSelectField';
import {
  fromDateTimeInput,
  memberTitle,
  toDateTimeInput,
  toNumber,
  userTitle,
} from './common/gameSettingsFormatters';

const defaultItem = {
  gameId: 0,
  caughtMemberId: 0,
  reportedByUserId: 0,
  status: 'active',
  positionId: 0,
  latitude: 0,
  longitude: 0,
  note: '',
  revertedByUserId: 0,
};

const CatchPage = () => {
  const { classes } = useSettingsStyles();
  const t = useTranslation();

  const [item, setItem] = useState();

  const validate = () => item && item.gameId > 0 && item.caughtMemberId > 0 && item.status;

  return (
    <EditItemView
      endpoint="catches"
      item={item}
      setItem={setItem}
      defaultItem={defaultItem}
      validate={validate}
      menu={<SettingsMenu />}
      breadcrumbs={['settingsTitle', 'gameCatch']}
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
                value={item.caughtMemberId || 0}
                emptyValue={0}
                onChange={(event) =>
                  setItem({ ...item, caughtMemberId: Number(event.target.value) })
                }
                endpoint="/api/members"
                titleGetter={memberTitle}
                label={t('gameCaughtMember')}
              />
              <GameLookupSelectField
                lookup="catchStatuses"
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
                value={item.reportedByUserId || 0}
                emptyValue={0}
                onChange={(event) =>
                  setItem({ ...item, reportedByUserId: Number(event.target.value) })
                }
                endpoint="/api/users?excludeAttributes=true"
                titleGetter={userTitle}
                label={t('gameReportedByUserId')}
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
              <TextField
                multiline
                minRows={3}
                value={item.note || ''}
                onChange={(event) => setItem({ ...item, note: event.target.value })}
                label={t('sharedNote')}
              />
              <SelectField
                value={item.revertedByUserId || 0}
                emptyValue={0}
                onChange={(event) =>
                  setItem({ ...item, revertedByUserId: Number(event.target.value) })
                }
                endpoint="/api/users?excludeAttributes=true"
                titleGetter={userTitle}
                label={t('gameRevertedByUserId')}
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
                value={toDateTimeInput(item.revertedAt)}
                onChange={(event) =>
                  setItem({ ...item, revertedAt: fromDateTimeInput(event.target.value) })
                }
                label={t('gameRevertedAt')}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </EditItemView>
  );
};

export default CatchPage;
