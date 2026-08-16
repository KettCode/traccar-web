import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Paper, Stack, Typography } from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import Loader from '../../common/components/Loader';
import { useTranslation } from '../../common/components/LocalizationProvider';
import useCurrentGame from './hooks/useCurrentGame';

const CurrentGamePage = () => {
  const navigate = useNavigate();
  const t = useTranslation();

  const { currentGame, loading } = useCurrentGame();

  useEffect(() => {
    if (currentGame) {
      navigate(`/game/${currentGame.id}`, { replace: true });
    }
  }, [currentGame, navigate]);

  if (loading || currentGame) {
    return <Loader />;
  }

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack spacing={2} alignItems="flex-start">
          <SportsEsportsIcon color="primary" fontSize="large" />
          <Typography variant="h5">{t('gameNoCurrentTitle')}</Typography>
          <Typography color="text.secondary">{t('gameNoCurrentDescription')}</Typography>
          <Button variant="contained" onClick={() => navigate('/')}>
            {t('mapTitle')}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default CurrentGamePage;
