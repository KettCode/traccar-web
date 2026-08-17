import { List } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import DrawIcon from '@mui/icons-material/Draw';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PeopleIcon from '@mui/icons-material/People';
import SendIcon from '@mui/icons-material/Send';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import TuneIcon from '@mui/icons-material/Tune';
import { useLocation } from 'react-router-dom';
import MenuItem from '../../../common/components/MenuItem';
import { useTranslation } from '../../../common/components/LocalizationProvider';

const isResource = (pathname, path) =>
  pathname === `/settings/${path}` || pathname.startsWith(`/settings/${path}/`);

const GameMaintenanceMenu = () => {
  const t = useTranslation();
  const location = useLocation();

  return (
    <List>
      <MenuItem
        title={t('gameTitle')}
        link="/settings/games"
        icon={<SportsEsportsIcon />}
        selected={
          isResource(location.pathname, 'games') ||
          isResource(location.pathname, 'game') ||
          location.pathname.startsWith('/settings/game/')
        }
      />
      <MenuItem
        title={t('gamePlayers')}
        link="/settings/game-players"
        icon={<PeopleIcon />}
        selected={
          isResource(location.pathname, 'game-player') ||
          isResource(location.pathname, 'game-players')
        }
      />
      <MenuItem
        title={t('gameMembers')}
        link="/settings/game-members"
        icon={<PeopleIcon />}
        selected={
          isResource(location.pathname, 'game-member') ||
          isResource(location.pathname, 'game-members')
        }
      />
      <MenuItem
        title={t('gameGeofences')}
        link="/settings/game-geofences"
        icon={<DrawIcon />}
        selected={
          isResource(location.pathname, 'game-geofence') ||
          isResource(location.pathname, 'game-geofences')
        }
      />
      <MenuItem
        title={t('gameSpeedhunts')}
        link="/settings/game-speedhunts"
        icon={<SendIcon />}
        selected={
          isResource(location.pathname, 'game-speedhunt') ||
          isResource(location.pathname, 'game-speedhunts')
        }
      />
      <MenuItem
        title={t('gamePings')}
        link="/settings/game-pings"
        icon={<NotificationsIcon />}
        selected={
          isResource(location.pathname, 'game-ping') || isResource(location.pathname, 'game-pings')
        }
      />
      <MenuItem
        title={t('gameJokers')}
        link="/settings/game-jokers"
        icon={<SportsEsportsIcon />}
        selected={
          isResource(location.pathname, 'game-joker') ||
          isResource(location.pathname, 'game-jokers')
        }
      />
      <MenuItem
        title={t('gameReveals')}
        link="/settings/game-reveals"
        icon={<TuneIcon />}
        selected={
          isResource(location.pathname, 'game-reveal') ||
          isResource(location.pathname, 'game-reveals')
        }
      />
      <MenuItem
        title={t('gameCatches')}
        link="/settings/game-catches"
        icon={<BuildIcon />}
        selected={
          isResource(location.pathname, 'game-catch') ||
          isResource(location.pathname, 'game-catches')
        }
      />
      <MenuItem
        title={t('gamePendingEffects')}
        link="/settings/game-pending-effects"
        icon={<BuildIcon />}
        selected={
          isResource(location.pathname, 'game-pending-effect') ||
          isResource(location.pathname, 'game-pending-effects')
        }
      />
    </List>
  );
};

export default GameMaintenanceMenu;
