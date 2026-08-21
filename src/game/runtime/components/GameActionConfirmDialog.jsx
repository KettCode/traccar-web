import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';

const GameActionConfirmDialog = ({ action, loading, onCancel, onConfirm, t }) => {
  if (!action) {
    return null;
  }

  return (
    <Dialog open onClose={loading ? undefined : onCancel} fullWidth maxWidth="xs">
      <DialogTitle>{action.title}</DialogTitle>
      {(action.message || action.details?.length > 0) && (
        <DialogContent>
          <Stack spacing={2}>
            {action.message && <DialogContentText>{action.message}</DialogContentText>}
            {action.details?.length > 0 && (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'fit-content(45%) minmax(0, 1fr)',
                  columnGap: 1.5,
                  rowGap: 0.75,
                  alignItems: 'baseline',
                }}
              >
                {action.details.map((detail, index) => (
                  <Box key={`${detail.label}-${index}`} sx={{ display: 'contents' }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      {detail.label}
                    </Typography>
                    <Typography variant="body2" sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
                      {detail.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Stack>
        </DialogContent>
      )}
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button disabled={loading} onClick={onCancel}>
          {t('sharedCancel')}
        </Button>
        <Button
          variant="contained"
          color={action.confirmColor || 'primary'}
          disabled={loading}
          onClick={onConfirm}
        >
          {action.confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GameActionConfirmDialog;
