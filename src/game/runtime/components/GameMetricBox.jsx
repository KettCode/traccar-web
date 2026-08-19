import { Box, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

const GameMetricBox = ({
  icon,
  label,
  value,
  color = 'primary',
  p = 1.5,
  borderRadius = 3,
  height,
  minHeight,
  valueVariant = 'h5',
  valueMt = 1,
  valueFontWeight = 900,
  backgroundAlpha = 0.08,
  borderAlpha = 0.16,
}) => (
  <Box
    sx={(theme) => ({
      p,
      height,
      minHeight,
      borderRadius,
      bgcolor: alpha(theme.palette[color]?.main || theme.palette.primary.main, backgroundAlpha),
      border: `1px solid ${alpha(
        theme.palette[color]?.main || theme.palette.primary.main,
        borderAlpha,
      )}`,
    })}
  >
    <Stack direction="row" spacing={0.75} alignItems="center" color={`${color}.main`}>
      {icon}
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Stack>
    <Typography variant={valueVariant} sx={{ mt: valueMt, fontWeight: valueFontWeight }}>
      {value}
    </Typography>
  </Box>
);

export default GameMetricBox;
