import { Typography } from "@mui/material";
import { formatTime } from "../../common/util/formatter";

const LocationItem = ({
    manhuntInfo,
    reload
}) => {
    if (!manhuntInfo || !manhuntInfo.group)
        return null;

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