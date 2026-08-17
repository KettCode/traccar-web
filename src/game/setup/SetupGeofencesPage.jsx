import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Divider, IconButton, Paper, Toolbar, Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { makeStyles } from 'tss-react/mui';
import { useNavigate } from 'react-router-dom';
import MapView from '../../map/core/MapView';
import MapCurrentLocation from '../../map/MapCurrentLocation';
import MapGeofenceEdit from '../../map/draw/MapGeofenceEdit';
import MapGeocoder from '../../map/control/MapGeocoder';
import MapScale from '../../map/MapScale';
import { useTranslation } from '../../common/components/LocalizationProvider';
import PageLayout from '../../common/components/PageLayout';
import fetchOrThrow from '../../common/util/fetchOrThrow';
import { errorsActions } from '../../store';
import GameSetupMenu from './GameSetupMenu';
import SetupGeofencesList from './SetupGeofencesList';

const useStyles = makeStyles()((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flexGrow: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column-reverse',
    },
  },
  drawer: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      width: theme.dimensions.drawerWidthDesktop,
    },
    [theme.breakpoints.down('sm')]: {
      height: theme.dimensions.drawerHeightPhone,
    },
  },
  mapContainer: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  fileInput: {
    display: 'none',
  },
}));

const SetupGeofencesPage = () => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const t = useTranslation();

  const [selectedGeofenceId, setSelectedGeofenceId] = useState();

  const handleFile = (event) => {
    const files = Array.from(event.target.files);
    const [file] = files;
    const reader = new FileReader();
    reader.onload = async () => {
      const xml = new DOMParser().parseFromString(reader.result, 'text/xml');
      const segment = xml.getElementsByTagName('trkseg')[0];
      const coordinates = Array.from(segment.getElementsByTagName('trkpt'))
        .map((point) => `${point.getAttribute('lat')} ${point.getAttribute('lon')}`)
        .join(', ');
      const area = `LINESTRING (${coordinates})`;
      const newItem = { name: t('sharedGeofence'), area };
      try {
        const response = await fetchOrThrow('/api/geofences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        });
        const item = await response.json();
        navigate(`/settings/geofence/${item.id}`);
      } catch (error) {
        dispatch(errorsActions.push(error.message));
      }
    };
    reader.onerror = (event) => {
      dispatch(errorsActions.push(event.target.error));
    };
    reader.readAsText(file);
  };

  return (
    <PageLayout menu={<GameSetupMenu />} breadcrumbs={['gameSetup', 'sharedGeofence']}>
      <div className={classes.root}>
        <div className={classes.content}>
          <Paper square className={classes.drawer}>
            <Toolbar>
              <Typography variant="h6" className={classes.title}>
                {t('sharedGeofences')}
              </Typography>
              <label htmlFor="setup-upload-gpx">
                <input
                  accept=".gpx"
                  id="setup-upload-gpx"
                  type="file"
                  className={classes.fileInput}
                  onChange={handleFile}
                />
                <IconButton edge="end" component="span" onClick={() => {}}>
                  <Tooltip title={t('sharedUpload')}>
                    <UploadFileIcon />
                  </Tooltip>
                </IconButton>
              </label>
            </Toolbar>
            <Divider />
            <SetupGeofencesList onGeofenceSelected={setSelectedGeofenceId} />
          </Paper>
          <div className={classes.mapContainer}>
            <MapView>
              <MapGeofenceEdit selectedGeofenceId={selectedGeofenceId} />
            </MapView>
            <MapScale />
            <MapCurrentLocation />
            <MapGeocoder />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SetupGeofencesPage;
