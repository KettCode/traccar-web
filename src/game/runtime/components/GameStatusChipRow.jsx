import { Stack } from '@mui/material';

const GameStatusChipRow = ({ children, sx }) => (
  <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={sx}>
    {children}
  </Stack>
);

export default GameStatusChipRow;
