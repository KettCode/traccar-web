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
