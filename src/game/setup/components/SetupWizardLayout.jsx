import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  LinearProgress,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import TableShimmer from '../../../common/components/TableShimmer';
import { useTranslation } from '../../../common/components/LocalizationProvider';
import GameStatusChip from '../../common/GameStatusChip';

const SetupWizardLayout = ({
  children,
  steps,
  activeStep,
  setActiveStep,
  loading,
  game,
  canContinue,
  onNext,
}) => {
  const t = useTranslation();
  const theme = useTheme();
  const phone = useMediaQuery(theme.breakpoints.down('sm'));
  const progress = ((activeStep + 1) / steps.length) * 100;

  return (
    <Box sx={{ minHeight: '100%', p: { xs: 1.5, md: 3 }, bgcolor: 'background.default' }}>
      <Stack spacing={2} sx={{ maxWidth: 1180, mx: 'auto' }}>
        <Card
          variant="outlined"
          sx={{
            overflow: 'hidden',
            background: `linear-gradient(135deg, ${theme.palette.primary.main}18, ${theme.palette.background.paper} 55%)`,
          }}
        >
          <CardContent>
            <Stack spacing={1.5}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
              >
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    {t('gameSetupWizard')}
                  </Typography>
                  <Typography variant={phone ? 'h5' : 'h4'}>
                    {game.name || t('gameSetupNewGame')}
                  </Typography>
                </Box>
                <GameStatusChip status={game.status} />
              </Stack>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                  <Typography variant="body2" color="text.secondary">
                    {`${t('gameSetupStep')} ${activeStep + 1} / ${steps.length}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {steps[activeStep].label}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{ height: 8, borderRadius: 99 }}
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '280px 1fr' },
            gap: 2,
            alignItems: 'start',
          }}
        >
          {!phone && (
            <Card variant="outlined" sx={{ position: 'sticky', top: 16 }}>
              <CardContent>
                <Stack spacing={1}>
                  {steps.map((step, index) => (
                    <CardActionArea
                      key={step.label}
                      onClick={() => setActiveStep(index)}
                      sx={{ borderRadius: 1.5 }}
                    >
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 1.5,
                          border: 1,
                          borderColor: index === activeStep ? 'primary.main' : 'divider',
                          bgcolor: index === activeStep ? 'action.selected' : 'transparent',
                        }}
                      >
                        <Typography variant="subtitle2">{step.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {step.description}
                        </Typography>
                      </Box>
                    </CardActionArea>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          )}
          <Card
            variant="outlined"
            sx={{ minHeight: { md: 560 }, display: 'flex', flexDirection: 'column' }}
          >
            <CardContent sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
              {phone && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6">{steps[activeStep].label}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {steps[activeStep].description}
                  </Typography>
                </Box>
              )}
              {loading ? <TableShimmer columns={1} /> : children}
            </CardContent>
            <CardActions
              sx={{
                position: 'sticky',
                bottom: 0,
                zIndex: 1,
                bgcolor: 'background.paper',
                borderTop: 1,
                borderColor: 'divider',
                justifyContent: 'space-between',
                p: 2,
              }}
            >
              <Button disabled={activeStep === 0} onClick={() => setActiveStep(activeStep - 1)}>
                {t('sharedBack')}
              </Button>
              <Button
                variant="contained"
                disabled={activeStep === steps.length - 1 || !canContinue}
                onClick={onNext}
              >
                {t('sharedNext')}
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
};

export default SetupWizardLayout;
