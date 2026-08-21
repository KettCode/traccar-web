import { alpha } from '@mui/material/styles';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CasinoIcon from '@mui/icons-material/Casino';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

export const jokerTypes = [
  'skip_ping',
  'fake_ping',
  'reveal_speedhunt',
  'request_hunter_locations',
];

export const terminalJokerStatuses = ['used', 'cancelled', 'expired'];

export const roleColor = (role) => {
  switch (role) {
    case 'game_management':
      return 'info';
    case 'hunter':
      return 'default';
    case 'hunted':
      return 'primary';
    default:
      return 'default';
  }
};

export const roleAvatarColor = (role) => {
  switch (role) {
    case 'game_management':
      return 'info.main';
    case 'hunter':
      return '#5e35b1';
    case 'hunted':
      return 'primary.main';
    default:
      return 'grey.500';
  }
};

export const roleChipSx = (role) => {
  if (role !== 'hunter') {
    return undefined;
  }
  return (theme) => ({
    color: theme.palette.mode === 'dark' ? '#d1c4e9' : '#4527a0',
    bgcolor: alpha('#5e35b1', theme.palette.mode === 'dark' ? 0.24 : 0.12),
    '& .MuiChip-icon': {
      color: 'inherit',
    },
  });
};

export const memberStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'caught':
      return 'error';
    case 'left':
      return 'default';
    default:
      return 'default';
  }
};

export const jokerStatusColor = (status) => {
  switch (status) {
    case 'unlocked':
      return 'primary';
    case 'activated':
      return 'warning';
    case 'used':
      return 'success';
    case 'cancelled':
    case 'expired':
      return 'default';
    default:
      return 'default';
  }
};

export const roleIcon = (role, props) => {
  switch (role) {
    case 'game_management':
      return <AdminPanelSettingsIcon {...props} />;
    case 'hunter':
      return <GpsFixedIcon {...props} />;
    case 'hunted':
      return <PersonSearchIcon {...props} />;
    default:
      return <GroupsIcon {...props} />;
  }
};

export const jokerIcon = (props) => <CasinoIcon {...props} />;

export const getActiveHuntedMembers = (members) =>
  (members || []).filter((member) => member.role === 'hunted' && member.status === 'active');

export const getCaughtHuntedMembers = (members) =>
  (members || []).filter((member) => member.role === 'hunted' && member.status === 'caught');

export const getHunterMembers = (members) =>
  (members || []).filter((member) => member.role === 'hunter');

export const getMemberJokers = (jokers, memberId) =>
  (jokers || []).filter((joker) => joker.memberId === memberId);

export const getJokerActivationMessage = (t, joker, summary) => {
  if (joker.status !== 'unlocked') {
    return t('gameJokerActivationUnavailable');
  }
  if (joker.type === 'reveal_speedhunt' && !summary.speedhuntActive) {
    return t('gameRevealSpeedhuntNeedsActive');
  }
  return null;
};
