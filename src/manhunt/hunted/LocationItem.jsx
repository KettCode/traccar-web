import { Typography } from "@mui/material";
import { formatTime } from "../../common/util/formatter";
import { useEffect } from "react";

const LocationItem = ({
    manhuntInfo,
    reload
}) => {
    if (!manhuntInfo || !manhuntInfo.group)
        return null;

    useEffect(() => {
        if (!manhuntInfo || !manhuntInfo.nextPosition) 
            return;
    
        const targetTime = new Date(manhuntInfo.nextPosition).getTime();
        const interval = setInterval(() => {
          const currentTime = new Date().getTime();
    
          if (currentTime >= targetTime) {
            reload();
            clearInterval(interval);
          }
        }, 1000);
    
        return () => clearInterval(interval);
    
      }, [manhuntInfo.nextPosition]);

    return <>
        <Typography variant="h4" sx={{ fontSize: '20px', zIndex: 2 }}>
            Letzte Standortmeldung
        </Typography>

        <Typography variant="h4" sx={{ fontSize: '14px', fontWeight: 'bold', zIndex: 2 }}>
            {formatTime(manhuntInfo.lastPosition, 'seconds')}
        </Typography>

        <Typography variant="h4" sx={{ fontSize: '20px', zIndex: 2, marginTop: "20px" }}>
            Nächste Standortmeldung
        </Typography>

        <Typography variant="h4" sx={{ fontSize: '14px', fontWeight: 'bold', zIndex: 2 }}>
            {formatTime(manhuntInfo.nextPosition, 'seconds')}
        </Typography>
    </>
}

export default LocationItem;