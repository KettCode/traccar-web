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
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";


dayjs.extend(utc);

const SpeedHunt = () => {
  const [timestamp, setTimestamp] = useState(Date.now());
  const classes = useSettingsStyles();
  const t = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [speedHuntInfo, setSpeedHuntInfo] = useState({});
  const [showBack, setShowBack] = useState(false);

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

  useEffect(() => {
    setShowBack(speedHuntInfo.isSpeedHuntRunning);
  }, [speedHuntInfo.isSpeedHuntRunning])

  const onCreated = useCatch(async () => {
    setTimestamp(Date.now());
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
            <div class="cards-wrapper">
              <div class="card-container">
                <div class="card" style={{
                  transform: showBack ? "rotateY(-180deg)" : "none"
                }}>
                  <div class="card-contents card-front">
                    <DirectionsRunIcon className='card-depth-icon' />
                    <div class="card-depth">
                      <SpeedHuntItem
                        speedHuntInfo={speedHuntInfo}
                        onCreated={onCreated} />
                    </div>
                  </div>
                  <div class="card-contents card-back">
                    <LocationOnIcon className='card-depth-icon' />
                    <div class="card-depth">
                      <LocationItem
                        speedHuntInfo={speedHuntInfo}
                        onCreated={onCreated} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <style>
              {
                `
                .cards-wrapper {
                  
                }
                .card-container {
                  perspective: 1200px;
                }
                .card {
                  margin: 0 auto;
                  border-radius: 50%;
                  width: 300px;
                  height: 300px;
                  position: relative;
                  transition: all 1s ease;
                  transform-style: preserve-3d;
                  box-shadow: 1px 3px 3px rgba(0,0,0,0.2)
                }

                .card-contents {
                  border-radius: 50%;
                  padding: 20px;
                  font-size: 14px;
                  width: 300px;
                  height: 300px;
                  margin-bottom: 2;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  gap: 5px;
                  align-items: center;
                  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
                  color: #fff;
                  background-color: #1976d2;
                  background: radial-gradient(circle at 100px 100px, #5cabff, #000);
                  text-align: center;
                  position: absolute;
                  top: 0;
                  left: 0;
                  backface-visibility: hidden;
                }
                .card-depth {
                  transform: translateZ(100px) scale(0.98);
                  perspective: inherit;
                }
                .card-depth-icon {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  height: 100%;
                  color: rgba(255, 255, 255, 0.3);
                  z-index: 1;
                  transform: translateZ(70px);
                }
                .card-front {       
                  transform-style: preserve-3d;
                }
                .card-back {
                  transform: rotateY(180deg);
                  transform-style: preserve-3d;
                }
                `
              }
            </style>
          </>
        )}
      </Container>
    </PageLayout>
  );
};

export default SpeedHunt;




