import { useState } from 'react';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import CloseIcon from '@mui/icons-material/Close';
import PendingIcon from '@mui/icons-material/Pending';
import { formatCoordinate, formatDistance, formatTime } from '../../common/util/formatter';
import { useAttributePreference, usePreference } from '../../common/util/preferences';

const useStyles = makeStyles()((theme) => ({
  root: {
    pointerEvents: 'none',
    position: 'fixed',
    zIndex: 5,
    left: '50%',
    transform: 'translateX(-50%)',
    [theme.breakpoints.up('md')]: {
      left: `calc(50% + ${theme.dimensions.drawerWidthDesktop} / 2)`,
      bottom: theme.spacing(3),
    },
    [theme.breakpoints.down('md')]: {
      bottom: `calc(${theme.spacing(3)} + ${theme.dimensions.bottomBarHeight}px)`,
    },
  },
  card: {
    pointerEvents: 'auto',
    width: theme.dimensions.popupMaxWidth,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1, 1, 0, 2),
    color: theme.palette.text.secondary,
  },
  content: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    maxHeight: theme.dimensions.cardContentMaxHeight,
    overflow: 'auto',
  },
  table: {
    '& .MuiTableCell-sizeSmall': {
      paddingLeft: 0,
      paddingRight: 0,
    },
    '& .MuiTableCell-sizeSmall:first-of-type': {
      paddingRight: theme.spacing(1),
    },
  },
  cell: {
    borderBottom: 'none',
  },
  actions: {
    justifyContent: 'space-between',
  },
}));

const markerSourceLabel = (t, source) => {
  switch (source) {
    case 'speedhunt':
      return t('gameSpeedhunt');
    case 'regular':
      return t('gamePing');
    case 'hunter_locations':
      return t('gameReveal');
    default:
      return t('sharedLocation');
  }
};

const StatusRow = ({ name, content }) => {
  const { classes } = useStyles();

  if (content == null || content === '') {
    return null;
  }

  return (
    <TableRow>
      <TableCell className={classes.cell}>
        <Typography variant="body2">{name}</Typography>
      </TableCell>
      <TableCell className={classes.cell}>
        <Typography variant="body2" color="textSecondary">
          {content}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

const GameMapMarkerCard = ({ marker, onClose, t }) => {
  const { classes } = useStyles();
  const coordinateFormat = usePreference('coordinateFormat');
  const distanceUnit = useAttributePreference('distanceUnit');
  const navigationAppLink = useAttributePreference('navigationAppLink');
  const navigationAppTitle = useAttributePreference('navigationAppTitle');
  const [anchorEl, setAnchorEl] = useState(null);

  const latitude = marker.latitude;
  const longitude = marker.longitude;
  const heading = marker.course || 0;

  return (
    <div className={classes.root}>
      <Card elevation={3} className={classes.card}>
        <CardMedia className={classes.header}>
          <Typography variant="body2" color="inherit" noWrap>
            {marker.displayName || t('sharedLocation')}
          </Typography>
          <IconButton size="small" color="inherit" onClick={onClose} onTouchStart={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </CardMedia>
        <CardContent className={classes.content}>
          <Table size="small" className={classes.table}>
            <TableBody>
              <StatusRow name={t('sharedType')} content={markerSourceLabel(t, marker.source)} />
              <StatusRow
                name={t('positionFixTime')}
                content={formatTime(marker.fixTime, 'seconds')}
              />
              <StatusRow
                name={t('positionAccuracy')}
                content={
                  Number.isFinite(marker.accuracy)
                    ? formatDistance(marker.accuracy, distanceUnit, t)
                    : null
                }
              />
              <StatusRow
                name={t('positionLatitude')}
                content={formatCoordinate('latitude', latitude, coordinateFormat)}
              />
              <StatusRow
                name={t('positionLongitude')}
                content={formatCoordinate('longitude', longitude, coordinateFormat)}
              />
            </TableBody>
          </Table>
        </CardContent>
        <CardActions className={classes.actions} disableSpacing>
          <Tooltip title={t('sharedExtra')}>
            <IconButton color="secondary" onClick={(event) => setAnchorEl(event.currentTarget)}>
              <PendingIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem
          component="a"
          target="_blank"
          href={`https://www.google.com/maps/search/?api=1&query=${latitude}%2C${longitude}`}
        >
          {t('linkGoogleMaps')}
        </MenuItem>
        <MenuItem
          component="a"
          target="_blank"
          href={`https://maps.apple.com/?ll=${latitude},${longitude}`}
        >
          {t('linkAppleMaps')}
        </MenuItem>
        <MenuItem
          component="a"
          target="_blank"
          href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${latitude}%2C${longitude}&heading=${heading}`}
        >
          {t('linkStreetView')}
        </MenuItem>
        {navigationAppTitle && navigationAppLink && (
          <MenuItem
            component="a"
            target="_blank"
            href={navigationAppLink
              .replace('{latitude}', latitude)
              .replace('{longitude}', longitude)}
          >
            {navigationAppTitle}
          </MenuItem>
        )}
      </Menu>
    </div>
  );
};

export default GameMapMarkerCard;
