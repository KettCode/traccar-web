export const formatGameRole = (t, role) => {
  switch (role) {
    case 'game_management':
      return t('gameRoleManagement');
    case 'hunter':
      return t('gameRoleHunter');
    case 'hunted':
      return t('gameRoleHunted');
    default:
      return role || '-';
  }
};

export const formatGameMemberStatus = (t, status) => {
  switch (status) {
    case 'active':
      return t('gameMemberStatusActive');
    case 'caught':
      return t('gameMemberStatusCaught');
    case 'left':
      return t('gameMemberStatusLeft');
    default:
      return status || '-';
  }
};

export const formatGameJokerType = (t, type) => {
  switch (type) {
    case 'skip_ping':
      return t('gameJokerTypeSkipPing');
    case 'fake_ping':
      return t('gameJokerTypeFakePing');
    case 'reveal_speedhunt':
      return t('gameJokerTypeRevealSpeedhunt');
    case 'request_hunter_locations':
      return t('gameJokerTypeRequestHunterLocations');
    default:
      return type || '-';
  }
};

export const formatGameJokerStatus = (t, status) => {
  switch (status) {
    case 'unlocked':
      return t('gameJokerStatusUnlocked');
    case 'activated':
      return t('gameJokerStatusActivated');
    case 'used':
      return t('gameJokerStatusUsed');
    case 'cancelled':
      return t('gameJokerStatusCancelled');
    case 'expired':
      return t('gameJokerStatusExpired');
    default:
      return status || '-';
  }
};

export const formatGameDurationSeconds = (t, value) => {
  if (value == null) {
    return '-';
  }

  const seconds = Math.max(0, Math.floor(value));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours} ${t('sharedHourAbbreviation')} ${minutes} ${t('sharedMinuteAbbreviation')}`;
  }
  if (minutes > 0) {
    return `${minutes} ${t('sharedMinuteAbbreviation')} ${remainingSeconds} ${t('sharedSecondAbbreviation')}`;
  }
  return `${remainingSeconds} ${t('sharedSecondAbbreviation')}`;
};
