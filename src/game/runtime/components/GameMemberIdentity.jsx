import { Avatar, Box, Stack, Typography } from '@mui/material';
import { roleAvatarColor, roleIcon } from './gameRuntimeUi';
import GameMemberChips from './GameMemberChips';

const GameMemberIdentity = ({
  member,
  t,
  avatarSize = 42,
  spacing = 1.25,
  titleVariant = 'subtitle1',
  titleFontWeight = 900,
  chipSx = { mt: 0.5 },
  children,
}) => (
  <Stack direction="row" spacing={spacing} alignItems="center" sx={{ minWidth: 0, width: '100%' }}>
    <Avatar sx={{ bgcolor: roleAvatarColor(member.role), width: avatarSize, height: avatarSize }}>
      {roleIcon(member.role)}
    </Avatar>
    <Box sx={{ minWidth: 0, flexGrow: 1 }}>
      <Typography variant={titleVariant} sx={{ minWidth: 0, fontWeight: titleFontWeight }} noWrap>
        {member.displayName}
      </Typography>
      <GameMemberChips member={member} t={t} sx={chipSx}>
        {children}
      </GameMemberChips>
    </Box>
  </Stack>
);

export default GameMemberIdentity;
