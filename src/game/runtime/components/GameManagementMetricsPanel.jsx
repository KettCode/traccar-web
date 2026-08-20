import { Grid } from '@mui/material';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import GameMetricBox from './GameMetricBox';
import { getActiveHuntedMembers, getCaughtHuntedMembers, getHunterMembers } from './gameRuntimeUi';

const GameManagementMetricsPanel = ({ state, t }) => (
  <Grid container spacing={1.25}>
    <Grid size={{ xs: 6, sm: 3 }}>
      <GameMetricBox
        icon={<PersonSearchIcon fontSize="small" />}
        label={t('gameActiveHunted')}
        value={getActiveHuntedMembers(state.members).length}
        color="success"
        minHeight={92}
      />
    </Grid>
    <Grid size={{ xs: 6, sm: 3 }}>
      <GameMetricBox
        icon={<WarningAmberIcon fontSize="small" />}
        label={t('gameCaughtHunted')}
        value={getCaughtHuntedMembers(state.members).length}
        color="error"
        minHeight={92}
      />
    </Grid>
    <Grid size={{ xs: 6, sm: 3 }}>
      <GameMetricBox
        icon={<GpsFixedIcon fontSize="small" />}
        label={t('gameFilterHunters')}
        value={getHunterMembers(state.members).length}
        color="primary"
        minHeight={92}
      />
    </Grid>
    <Grid size={{ xs: 6, sm: 3 }}>
      <GameMetricBox
        icon={<VisibilityIcon fontSize="small" />}
        label={t('gameAvailableSpeedhunts')}
        value={state.summary.speedhuntsRemaining}
        color="info"
        minHeight={92}
      />
    </Grid>
  </Grid>
);

export default GameManagementMetricsPanel;
