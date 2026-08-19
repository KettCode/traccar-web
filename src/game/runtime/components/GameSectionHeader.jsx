import { Avatar, Box, Stack, Typography } from '@mui/material';

const GameSectionHeader = ({ icon, title, description, color = 'primary', action }) => (
  <Stack
    direction="row"
    spacing={1.5}
    alignItems="center"
    justifyContent="space-between"
    sx={{ width: '100%' }}
  >
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, flexGrow: 1 }}>
      <Avatar
        variant="rounded"
        sx={{
          width: 42,
          height: 42,
          bgcolor: `${color}.main`,
          color: `${color}.contrastText`,
        }}
      >
        {icon}
      </Avatar>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h6" sx={{ lineHeight: 1.15 }}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </Box>
    </Stack>
    {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
  </Stack>
);

export default GameSectionHeader;
