import { Typography } from "@mui/material";
import { formatTime } from "../../common/util/formatter";

const LocationItem = ({
    manhuntInfo,
    reload
}) => {
    if (!manhuntInfo || !manhuntInfo.group)
        return null;

    return <>
        <Typography variant="h4" sx={{ fontSize: '24px', zIndex: 2 }}>
            Letzter Standort
        </Typography>

        <Typography variant="h4" sx={{ fontSize: '14px', fontWeight: 'bold', zIndex: 2 }}>
            {formatTime(manhuntInfo.lastPosition, 'seconds')}
        </Typography>

        <Typography variant="h4" sx={{ fontSize: '24px', zIndex: 2 }}>
            Nächste Standort
        </Typography>

        <Typography variant="h4" sx={{ fontSize: '14px', fontWeight: 'bold', zIndex: 2 }}>
            {formatTime(manhuntInfo.nextPosition, 'seconds')}
        </Typography>
    </>
}

export default LocationItem;