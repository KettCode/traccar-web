import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GameJokerDeck from './GameJokerDeck';

const ManagementAccordion = ({ title, count, children }) => (
  <Accordion
    disableGutters
    elevation={0}
    sx={(theme) => ({
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: '16px !important',
      '&:before': { display: 'none' },
    })}
  >
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%', pr: 1 }}>
        <Typography variant="subtitle1" sx={{ flexGrow: 1, fontWeight: 800 }}>
          {title}
        </Typography>
        <Chip size="small" label={count} />
      </Stack>
    </AccordionSummary>
    <AccordionDetails sx={{ pt: 0 }}>{children}</AccordionDetails>
  </Accordion>
);

const GameManagementDetails = ({ state, actionLoading, onActivateJoker, onCancelJoker, t }) => {
  const jokers = state.jokers || [];
  const speedhuntHistory = state.speedhuntHistory || [];

  return (
    <Stack spacing={1.25}>
      <ManagementAccordion title={t('gameJokerOverview')} count={jokers.length}>
        <GameJokerDeck
          jokers={jokers}
          summary={state.summary}
          canUseJoker={state.allowedActions.canUseJoker}
          canManageRuntime={state.allowedActions.canManageRuntime}
          actionLoading={actionLoading}
          onActivate={onActivateJoker}
          onCancel={onCancelJoker}
          t={t}
        />
      </ManagementAccordion>

      <ManagementAccordion title={t('gameSpeedhuntOverview')} count={speedhuntHistory.length}>
        {speedhuntHistory.length > 0 ? (
          <Stack spacing={1}>
            {speedhuntHistory.map((speedhunt) => (
              <Box
                key={speedhunt.id}
                sx={(theme) => ({
                  p: 1.5,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                })}
              >
                <Stack direction="row" justifyContent="space-between" spacing={1}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle2">
                      {t('gameSpeedhunt')} #{speedhunt.sequenceNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {speedhunt.targetRevealed
                        ? speedhunt.targetDisplayName || t('gameUnknownTarget')
                        : t('gameSpeedhuntTargetHidden')}
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    color={speedhunt.active ? 'error' : 'default'}
                    label={speedhunt.active ? t('gameSpeedhuntActive') : t('gameSpeedhuntFinished')}
                  />
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography variant="caption" color="text.secondary">
                    {t('gameSpeedhuntPingProgress')}:
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {speedhunt.pingNumber} / {speedhunt.maxPings}
                  </Typography>
                </Stack>
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography color="text.secondary">{t('gameNoSpeedhuntHistory')}</Typography>
        )}
      </ManagementAccordion>
    </Stack>
  );
};

export default GameManagementDetails;
