import React, { useState } from 'react';
import { useTranslation } from '../../common/components/LocalizationProvider';
import useSettingsStyles from '../../settings/common/useSettingsStyles';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import PageLayout from '../../common/components/PageLayout';
import { useNavigate, useParams } from 'react-router-dom';
import HttpsIcon from "@mui/icons-material/Https";
import CatchItem from './CatchItem';
import { useEffectAsync } from '../../reactHelper';
import { useSelector } from 'react-redux';
import Card from '../Card';
import CatchDrawer from './CatchDrawer';
import DrawerButton from '../DrawerButton';


dayjs.extend(utc);

const Catch = () => {
  const [timestamp, setTimestamp] = useState(Date.now());
  const classes = useSettingsStyles();
  const t = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const devices = useSelector((state) => state.devices.items);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [huntedDevices, setHuntedDevices] = useState([]);
  const [showBack, setShowBack] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);

  useEffectAsync(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/catches/getCurrentManhunt');
      if (response.ok) {
        setItems(await response.json());
      } else {
        throw Error(await response.text());
      }
    } finally {
      setLoading(false);
    }
  }, [timestamp]);

  useEffectAsync(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/manhunts/huntedDevices');
      if (response.ok) {
        setHuntedDevices(await response.json());
      } else {
        throw Error(await response.text());
      }
    } finally {
      setLoading(false);
    }
  }, [timestamp]);

  const cardFront = () => {
    return <>
      <HttpsIcon className='card-depth-icon' />
      <div class="card-depth">
        <CatchItem
          onCreated={() => setTimestamp(Date.now())}
          reload={() => setTimestamp(Date.now())}
        />
      </div>
    </>
  }

  const cardBack = () => {
    return null;
  }

  return (
    <PageLayout menu={<></>} breadcrumbs={['', '']} >
      <div maxWidth="xs" className={classes.container}
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column"
        }}>
        {items && (
          <>
            <DrawerButton
              title={"Übersicht"}
              onClick={() => setEventsOpen(true)}
            />
            <CatchDrawer
              open={eventsOpen}
              onClose={() => setEventsOpen(false)}
              catches={items}
              huntedDevices={huntedDevices}
            />
            <Card
              cardFront={cardFront}
              cardBack={cardBack}
              showBack={showBack}
            />
          </>)
        }
      </div>
    </PageLayout>
  );
};

export default Catch;




