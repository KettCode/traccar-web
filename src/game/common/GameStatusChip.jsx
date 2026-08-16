import { Chip } from '@mui/material';
import { useTranslation } from '../../common/components/LocalizationProvider';

const statusColors = {
  draft: 'default',
  running: 'success',
  finished: 'info',
};

const GameStatusChip = ({ status }) => {
  const t = useTranslation();
  return (
    <Chip
      size="small"
      color={statusColors[status] || 'default'}
      label={status ? t(`gameStatus${status.replace(/^\w/, (c) => c.toUpperCase())}`) : '-'}
    />
  );
};

export default GameStatusChip;
