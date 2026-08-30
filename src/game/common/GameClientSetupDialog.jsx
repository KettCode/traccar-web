import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  useTheme,
} from '@mui/material';
import { QRCode } from 'react-qr-code';
import { useTranslation } from '../../common/components/LocalizationProvider';

const GameClientSetupDialog = ({ item, onClose }) => {
  const theme = useTheme();
  const t = useTranslation();
  const link = item?.clientSetupLink || '';

  return (
    <Dialog open={!!item} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{t('sharedQrCode')}</DialogTitle>
      <DialogContent>
        {link && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <QRCode value={link} size={theme.dimensions.qrCodeSize} />
            </Box>
            <TextField
              value={link}
              label={t('sharedLink')}
              fullWidth
              multiline
              slotProps={{ input: { readOnly: true } }}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button disabled={!link} onClick={() => navigator.clipboard?.writeText(link)}>
          {t('sharedCopy')}
        </Button>
        <Button disabled={!link} href={link}>
          {t('sharedLink')}
        </Button>
        <Button onClick={onClose}>{t('sharedCancel')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default GameClientSetupDialog;
