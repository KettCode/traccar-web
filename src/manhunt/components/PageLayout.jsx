import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import { useNavigate } from "react-router-dom";
import { IconButton, Toolbar, useMediaQuery, useTheme } from "@mui/material";

const PageLayout = ({
    openEvents,
    children
}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const desktop = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            height: "100%"
        }}>
            <Toolbar>
                {desktop && (
                    <IconButton color="inherit" edge="start" sx={{ mr: 2 }} onClick={() => navigate('/')}>
                        <ArrowBackIcon />
                    </IconButton>
                )}
                <IconButton sx={{ marginLeft: "auto" }} onClick={() => openEvents()}>
                    <KeyboardDoubleArrowLeftIcon />
                </IconButton>
            </Toolbar>
            <div maxWidth="xs"
                style={{
                    position: "relative",
                    display: "flex",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                {children}
            </div>
        </div>
    );
};

export default PageLayout;