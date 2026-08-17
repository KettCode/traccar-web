import { List } from '@mui/material';
import DrawIcon from '@mui/icons-material/Draw';
import PeopleIcon from '@mui/icons-material/People';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { useLocation } from 'react-router-dom';
import MenuItem from '../../common/components/MenuItem';
import { useTranslation } from '../../common/components/LocalizationProvider';

const GameSetupMenu = () => {
  const t = useTranslation();
  const location = useLocation();
  const path = location.pathname;

  return (
    <List>
      <MenuItem
        title={t('gameGame')}
        link="/game/setup"
        icon={<SportsEsportsIcon />}
        selected={
          path === '/game/setup' ||
          path === '/game/setup/game' ||
          path === '/game/setup/wizard' ||
          /^\/game\/setup\/\d+$/.test(path) ||
          /^\/game\/setup\/\d+\/wizard$/.test(path)
        }
      />
      <MenuItem
        title={t('gamePlayer')}
        link="/game/setup/players"
        icon={<PeopleIcon />}
        selected={path === '/game/setup/players' || path.endsWith('/players')}
      />
      <MenuItem
        title={t('sharedGeofence')}
        link="/game/setup/geofences"
        icon={<DrawIcon />}
        selected={path === '/game/setup/geofences' || path.startsWith('/game/setup/geofence')}
      />
    </List>
  );
};

export default GameSetupMenu;
