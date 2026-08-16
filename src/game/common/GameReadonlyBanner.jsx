import { Alert } from '@mui/material';
import { useTranslation } from '../../common/components/LocalizationProvider';

const GameReadonlyBanner = ({ readonly }) => {
  const t = useTranslation();

  if (!readonly) {
    return null;
  }

  return <Alert severity="info">{t('gameReadonlyState')}</Alert>;
};

export default GameReadonlyBanner;
