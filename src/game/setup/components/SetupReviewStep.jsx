import { Alert, Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../../common/components/LocalizationProvider';

const SetupReviewStep = ({ wizard }) => {
  const t = useTranslation();
  const navigate = useNavigate();
  const issues = wizard.state?.issues || [];
  const editable = wizard.editable;

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h6">{t('gameSetupReview')}</Typography>
        <Typography variant="body2" color="text.secondary">
          {t('gameSetupReviewDescription')}
        </Typography>
      </Box>
      {wizard.started && (
        <Alert
          severity="success"
          action={
            <Button onClick={() => navigate('/game/setup')}>{t('gameSetupBackToGames')}</Button>
          }
        >
          {t('gameSetupStarted')}
        </Alert>
      )}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
        <ReviewCard
          ok={!!wizard.game.name}
          title={t('gameSetupGeneral')}
          detail={wizard.game.name || t('gameSetupMissing')}
        />
        <ReviewCard
          ok={(wizard.state?.members || []).length > 0}
          title={t('gamePlayer')}
          detail={`${(wizard.state?.members || []).length} ${t('gamePlayers')}`}
        />
        <ReviewCard
          ok={(wizard.state?.geofences || []).length > 0}
          title={t('sharedGeofence')}
          detail={`${(wizard.state?.geofences || []).length} ${t('gameGeofences')}`}
        />
        {editable && (
          <ReviewCard
            ok={!issues.length}
            title={t('gameSetupValidation')}
            detail={issues.length ? t('gameSetupIssuesFound') : t('gameSetupReady')}
          />
        )}
      </Box>
      {editable && !!issues.length && (
        <Stack spacing={1}>
          {issues.map((issue) => (
            <Alert key={issue} severity="warning">
              {issue}
            </Alert>
          ))}
        </Stack>
      )}
      {editable && (
        <Box>
          <Button
            variant="contained"
            onClick={wizard.startGame}
            disabled={!wizard.state?.ready || wizard.started}
          >
            {t('gameStart')}
          </Button>
        </Box>
      )}
    </Stack>
  );
};

const ReviewCard = ({ ok, title, detail }) => (
  <Card variant="outlined">
    <CardContent>
      <Stack direction="row" spacing={1.5} alignItems="center">
        {ok ? <CheckCircleIcon color="success" /> : <WarningAmberIcon color="warning" />}
        <Box>
          <Typography variant="subtitle1">{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {detail}
          </Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

export default SetupReviewStep;
