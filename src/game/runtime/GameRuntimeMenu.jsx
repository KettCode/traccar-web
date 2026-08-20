import { BottomNavigation, BottomNavigationAction, Badge } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import PersonIcon from '@mui/icons-material/Person';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { sessionActions } from '../../store';
import { nativePostMessage } from '../../common/components/NativeInterface';
import { useTranslation } from '../../common/components/LocalizationProvider';
import GameRuntimeUserSheet from './components/GameRuntimeUserSheet';

const GameRuntimeMenu = ({ currentGame }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const t = useTranslation();

  const user = useSelector((state) => state.session.user);
  const socket = useSelector((state) => state.session.socket);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const currentSelection = () => {
    if (location.pathname === '/') {
      return 'map';
    }
    if (location.pathname === '/game' || location.pathname.startsWith('/game/')) {
      return 'game';
    }
    return null;
  };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    const notificationToken = window.localStorage.getItem('notificationToken');
    if (notificationToken && !user.readonly) {
      window.localStorage.removeItem('notificationToken');
      const tokens = user.attributes.notificationTokens?.split(',') || [];
      if (tokens.includes(notificationToken)) {
        const updatedUser = {
          ...user,
          attributes: {
            ...user.attributes,
            notificationTokens:
              tokens.length > 1
                ? tokens.filter((it) => it !== notificationToken).join(',')
                : undefined,
          },
        };
        await fetch(`/api/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUser),
        });
      }
    }

    await fetch('/api/session', { method: 'DELETE' });
    nativePostMessage('logout');
    navigate('/login');
    dispatch(sessionActions.updateUser(null));
  };

  const handleSelection = (value) => {
    switch (value) {
      case 'map':
        navigate('/');
        break;
      case 'game':
        navigate(currentGame?.id ? `/game/${currentGame.id}` : '/game');
        break;
      case 'profile':
        setUserMenuOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <BottomNavigation
        value={currentSelection()}
        onChange={(event, value) => handleSelection(value)}
        showLabels
      >
        <BottomNavigationAction
          label={t('mapTitle')}
          icon={
            <Badge color="error" variant="dot" overlap="circular" invisible={socket !== false}>
              <MapIcon />
            </Badge>
          }
          value="map"
        />
        <BottomNavigationAction label={t('gameGame')} icon={<SportsEsportsIcon />} value="game" />
        <BottomNavigationAction label={t('gameProfile')} icon={<PersonIcon />} value="profile" />
      </BottomNavigation>
      <GameRuntimeUserSheet
        open={userMenuOpen}
        currentGame={currentGame}
        user={user}
        socket={socket}
        onClose={() => setUserMenuOpen(false)}
        onLogout={handleLogout}
        t={t}
      />
    </>
  );
};

export default GameRuntimeMenu;
