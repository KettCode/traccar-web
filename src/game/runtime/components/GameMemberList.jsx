import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import CasinoIcon from '@mui/icons-material/Casino';
import EditIcon from '@mui/icons-material/Edit';
import GroupsIcon from '@mui/icons-material/Groups';
import { useMemo, useState } from 'react';
import GameMemberIdentity from './GameMemberIdentity';
import { getMemberJokers } from './gameRuntimeUi';

const roleOrder = {
  hunted: 0,
  hunter: 1,
  game_management: 2,
};

const filterOptions = [
  ['all', 'gameFilterAllPlayers'],
  ['activeHunted', 'gameFilterActiveHunted'],
  ['caughtHunted', 'gameFilterCaughtHunted'],
  ['hunter', 'gameFilterHunters'],
  ['management', 'gameFilterManagement'],
];

const filterMembers = (members, filter) => {
  switch (filter) {
    case 'activeHunted':
      return members.filter((member) => member.role === 'hunted' && member.status === 'active');
    case 'caughtHunted':
      return members.filter((member) => member.role === 'hunted' && member.status === 'caught');
    case 'hunter':
      return members.filter((member) => member.role === 'hunter');
    case 'management':
      return members.filter((member) => member.role === 'game_management');
    default:
      return members;
  }
};

const sortMembers = (members) =>
  [...members].sort((a, b) => {
    const roleCompare = (roleOrder[a.role] ?? 99) - (roleOrder[b.role] ?? 99);
    if (roleCompare !== 0) {
      return roleCompare;
    }
    return (a.displayName || '').localeCompare(b.displayName || '');
  });

const PlayerCard = ({ member, jokerCount, management, selected, onSelect, t }) => {
  const content = (
    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <GameMemberIdentity
          member={member}
          t={t}
          avatarSize={48}
          titleFontWeight={800}
          chipSx={{ mt: 0.75 }}
        >
          {jokerCount > 0 && <Chip size="small" icon={<CasinoIcon />} label={jokerCount} />}
        </GameMemberIdentity>
        {management && <EditIcon color="action" fontSize="small" sx={{ flexShrink: 0 }} />}
      </Stack>
    </CardContent>
  );

  return (
    <Card
      variant="outlined"
      sx={(theme) => ({
        borderRadius: 3,
        borderColor: selected ? theme.palette.primary.main : undefined,
        bgcolor: selected ? alpha(theme.palette.primary.main, 0.06) : undefined,
      })}
    >
      {management ? (
        <CardActionArea onClick={() => onSelect(member)}>{content}</CardActionArea>
      ) : (
        content
      )}
    </Card>
  );
};

const GameMemberList = ({ state, selectedMemberId, onSelectMember, t }) => {
  const [filter, setFilter] = useState('all');
  const management = state.currentMember.role === 'game_management';
  const visibleMembers = useMemo(
    () => sortMembers(filterMembers(state.members || [], filter)),
    [filter, state.members],
  );

  return (
    <Card variant="outlined" sx={{ borderRadius: 4 }}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Avatar variant="rounded" sx={{ bgcolor: 'primary.main' }}>
              <GroupsIcon />
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6">{t('gamePlayers')}</Typography>
              <Typography variant="body2" color="text.secondary">
                {management ? t('gamePlayersManagementDescription') : t('gamePlayersDescription')}
              </Typography>
            </Box>
          </Stack>

          {management && (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {filterOptions.map(([value, label]) => (
                <Chip
                  key={value}
                  clickable
                  color={filter === value ? 'primary' : 'default'}
                  label={t(label)}
                  onClick={() => setFilter(value)}
                />
              ))}
            </Stack>
          )}

          <Stack spacing={1}>
            {visibleMembers.length > 0 ? (
              visibleMembers.map((member) => (
                <PlayerCard
                  key={member.id}
                  member={member}
                  jokerCount={getMemberJokers(state.jokers, member.id).length}
                  management={management}
                  selected={selectedMemberId === member.id}
                  onSelect={onSelectMember}
                  t={t}
                />
              ))
            ) : (
              <Typography color="text.secondary">{t('gameNoPlayersForFilter')}</Typography>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default GameMemberList;
