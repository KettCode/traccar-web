import { List } from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { useLocation } from 'react-router-dom';
import MenuItem from '../../common/components/MenuItem';
import { useTranslation } from '../../common/components/LocalizationProvider';

const GameRuntimePageMenu = ({ currentGame }) => {
  const t = useTranslation();
  const location = useLocation();

  return (
    <List>
      <MenuItem
        title={t('gameGame')}
        link={currentGame?.id ? `/game/${currentGame.id}` : '/game'}
        icon={<SportsEsportsIcon />}
        selected={location.pathname === '/game' || /^\/game\/\d+$/.test(location.pathname)}
      />
    </List>
  );
};

export default GameRuntimePageMenu;
