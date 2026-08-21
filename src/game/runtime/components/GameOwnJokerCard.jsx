import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { formatGameJokerType } from '../../common/gameFormatters';
import GameJokerDeck from './GameJokerDeck';

const GameOwnJokerCard = ({
  jokers,
  summary,
  canUseJoker,
  actionLoading,
  revealedLocationsByJoker,
  revealLoading,
  onActivateJoker,
  onShowRevealLocations,
  onHideRevealLocations,
  t,
}) => {
  return (
    <Card variant="outlined" sx={{ width: '100%', borderRadius: 4 }}>
      <CardContent sx={{ p: { xs: 1.25, sm: 1.5 }, '&:last-child': { pb: { xs: 1.25, sm: 1.5 } } }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">{t('gameYourJokers')}</Typography>
          {summary.activeJokerEffect && (
            <Box
              sx={(theme) => ({
                p: 1.25,
                borderRadius: 2.5,
                bgcolor: alpha(theme.palette.warning.main, 0.1),
              })}
            >
              <Typography variant="caption" color="text.secondary">
                {t('gameActiveJokerEffects')}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 0.75 }}>
                {summary.activeJokerTypes.length > 0 ? (
                  summary.activeJokerTypes.map((type) => (
                    <Chip
                      key={type}
                      size="small"
                      color="warning"
                      label={formatGameJokerType(t, type)}
                    />
                  ))
                ) : (
                  <Chip size="small" color="warning" label={t('gameJokerEffectActive')} />
                )}
              </Stack>
            </Box>
          )}
          <GameJokerDeck
            jokers={jokers}
            summary={summary}
            canUseJoker={canUseJoker}
            actionLoading={actionLoading}
            revealedLocationsByJoker={revealedLocationsByJoker}
            revealLoading={revealLoading}
            onActivate={onActivateJoker}
            onShowRevealLocations={onShowRevealLocations}
            onHideRevealLocations={onHideRevealLocations}
            t={t}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default GameOwnJokerCard;
