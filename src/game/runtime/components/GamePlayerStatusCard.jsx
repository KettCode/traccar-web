import { Box, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { formatGameJokerType } from '../../common/gameFormatters';
import GameJokerDeck from './GameJokerDeck';
import GameMemberIdentity from './GameMemberIdentity';

const GamePlayerStatusCard = ({
  member,
  jokers,
  summary,
  canUseJoker,
  actionLoading,
  onActivateJoker,
  t,
}) => {
  return (
    <Card variant="outlined" sx={{ borderRadius: 4 }}>
      <CardContent sx={{ p: { xs: 1.25, sm: 1.5 }, '&:last-child': { pb: { xs: 1.25, sm: 1.5 } } }}>
        <Stack spacing={1.5}>
          <GameMemberIdentity member={member} t={t} />
          {member.role === 'hunted' &&
            (canUseJoker || summary.activeJokerEffect || jokers?.length > 0) && (
              <Stack spacing={1.25}>
                <Divider />
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
                  onActivate={onActivateJoker}
                  t={t}
                />
              </Stack>
            )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default GamePlayerStatusCard;
