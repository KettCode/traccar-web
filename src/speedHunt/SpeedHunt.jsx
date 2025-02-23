import React, { useEffect, useState } from 'react';
import {
  Container
} from '@mui/material';
import { useTranslation } from '../common/components/LocalizationProvider';
import useSettingsStyles from '../settings/common/useSettingsStyles';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import PageLayout from '../common/components/PageLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { useCatch, useEffectAsync } from '../reactHelper';
import SpeedHuntItem from './SpeedHuntItem';
import LocationItem from './LocationItem';


dayjs.extend(utc);

const SpeedHunt = () => {
  const [timestamp, setTimestamp] = useState(Date.now());
  const classes = useSettingsStyles();
  const t = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [speedHuntInfo, setSpeedHuntInfo] = useState();
  const [showAnimation, setShowAnimation] = useState(false);

  useEffectAsync(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/speedHunts/speedHuntInfo`);
      if (response.ok) {
        setSpeedHuntInfo(await response.json());
      } else {
        throw Error(await response.text());
      }
    } finally {
      setLoading(false);
    }
  }, [timestamp]);

  const onCreated = useCatch(async () => {
    setTimestamp(Date.now());
    setShowAnimation(true);
    setTimeout(() => {
      setShowAnimation(false);
    }, 500)
  });

  return (
    <PageLayout menu={<></>} breadcrumbs={['', '']}>
      <Container maxWidth="xs" className={classes.container}
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
        {speedHuntInfo && (
          <>
            <div
              variant="contained"
              color="primary"
              style={{
                position: "relative",
                borderRadius: '50%',
                padding: '20px',
                fontSize: '14px',
                width: '300px',
                height: '300px',
                marginBottom: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '5px',
                alignItems: 'center',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                color: '#fff',
                backgroundColor: '#1976d2',
                background: 'radial-gradient(circle at 100px 100px, #5cabff, #000)',
                textAlign: 'center',
                transformStyle: 'preserve-3d',
                perspective: '1500px',
                animation: showAnimation ? 'rotateBox 0.5s 1 ease-in-out' : "none",
                transition: 'transform 0.3s ease'
              }}
            >
              {
                speedHuntInfo.isSpeedHuntRunning ?
                  <LocationItem
                    speedHuntInfo={speedHuntInfo}
                    onCreated={onCreated} /> :
                  <SpeedHuntItem
                    speedHuntInfo={speedHuntInfo}
                    onCreated={onCreated} />
              }
              <style>
                {
                  `
                    @keyframes rotateBox {
                      0% {
                        transform: rotate3d(1, 1, 0, 0deg);
                      }
                      25% {
                        transform: rotate3d(1, 1, 0, 90deg);
                      }
                      50% {
                        transform: rotate3d(1, 1, 0, 180deg);
                      }
                      75% {
                        transform: rotate3d(1, 1, 0, 270deg);
                      }
                      100% {
                        transform: rotate3d(1, 1, 0, 360deg);
                      }
                    }
                  `
                }
              </style>
            </div>
          </>
        )}
      </Container>
    </PageLayout>
  );
};

export default SpeedHunt;




