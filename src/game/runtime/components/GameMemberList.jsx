import { Avatar, Box, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import CasinoIcon from '@mui/icons-material/Casino';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GroupsIcon from '@mui/icons-material/Groups';
import { useMemo } from 'react';
import GameMemberIdentity from './GameMemberIdentity';
import { getMemberJokers } from './gameRuntimeUi';

const roleOrder = {
  hunted: 0,
  hunter: 1,
  game_management: 2,
};

const sortMembers = (members) =>
  [...members].sort((a, b) => {
    const roleCompare = (roleOrder[a.role] ?? 99) - (roleOrder[b.role] ?? 99);
    if (roleCompare !== 0) {
      return roleCompare;
    }
    return (a.displayName || '').localeCompare(b.displayName || '');
  });

const PlayerRow = ({ member, jokerCount, management, selected, current, last, onSelect, t }) => {
  const content = (
    <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <GameMemberIdentity
          member={member}
          t={t}
          avatarSize={40}
          titleFontWeight={800}
          chipSx={{ mt: 0.5 }}
        >
          {current && <Chip size="small" label={t('gameYou')} />}
          {jokerCount > 0 && <Chip size="small" icon={<CasinoIcon />} label={jokerCount} />}
        </GameMemberIdentity>
        {management && <ChevronRightIcon color="action" fontSize="small" sx={{ flexShrink: 0 }} />}
      </Stack>
    </CardContent>
  );

  return (
    <Box
      sx={(theme) => ({
        position: 'relative',
        bgcolor: selected ? alpha(theme.palette.primary.main, 0.06) : undefined,
        borderBottom: last ? 'none' : `1px solid ${theme.palette.divider}`,
        '&:before': selected
          ? {
              content: '""',
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: 3,
              bgcolor: theme.palette.primary.main,
            }
          : undefined,
      })}
    >
      {management ? (
        <CardActionArea onClick={() => onSelect(member)}>{content}</CardActionArea>
      ) : (
        content
      )}
    </Box>
  );
};

const GameMemberList = ({ state, selectedMemberId, onSelectMember, t }) => {
  const management = state.currentMember.role === 'game_management';
  const visibleMembers = useMemo(() => sortMembers(state.members || []), [state.members]);
  const totalMembers = state.members?.length || 0;

  return (
    <Box
      sx={(theme) => ({
        borderRadius: 4,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        overflow: 'hidden',
      })}
    >
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Avatar variant="rounded" sx={{ bgcolor: 'primary.main' }}>
              <GroupsIcon />
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6">
                {t('gamePlayers')} ({totalMembers})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {management ? t('gamePlayersManagementDescription') : t('gamePlayersDescription')}
              </Typography>
            </Box>
          </Stack>

          <Box
            sx={(theme) => ({
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              overflow: 'hidden',
            })}
          >
            {visibleMembers.length > 0 ? (
              visibleMembers.map((member, index) => (
                <PlayerRow
                  key={member.id}
                  member={member}
                  jokerCount={getMemberJokers(state.jokers, member.id).length}
                  management={management}
                  selected={selectedMemberId === member.id}
                  current={state.currentMember.id === member.id}
                  last={index === visibleMembers.length - 1}
                  onSelect={onSelectMember}
                  t={t}
                />
              ))
            ) : (
              <Typography color="text.secondary">{t('gameNoPlayersForFilter')}</Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Box>
  );
};

export default GameMemberList;
