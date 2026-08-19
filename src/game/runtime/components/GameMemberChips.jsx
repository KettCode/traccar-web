import { Chip } from '@mui/material';
import { formatGameMemberStatus, formatGameRole } from '../../common/gameFormatters';
import { memberStatusColor, roleChipSx, roleColor } from './gameRuntimeUi';
import GameStatusChipRow from './GameStatusChipRow';

const GameMemberChips = ({ member, t, children, sx }) => {
  const showStatus = member.status && member.status !== 'active';

  return (
    <GameStatusChipRow sx={sx}>
      <Chip
        size="small"
        color={roleColor(member.role)}
        label={formatGameRole(t, member.role)}
        sx={roleChipSx(member.role)}
      />
      {showStatus && (
        <Chip
          size="small"
          color={memberStatusColor(member.status)}
          label={formatGameMemberStatus(t, member.status)}
        />
      )}
      {children}
    </GameStatusChipRow>
  );
};

export default GameMemberChips;
