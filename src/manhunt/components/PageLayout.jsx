import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
import { AppBar, Breadcrumbs, IconButton, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const PageLayout = ({
    title,
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
            {desktop ?
                <Toolbar>
                    <IconButton color="inherit" edge="start" sx={{ mr: 2 }} onClick={() => navigate('/')}>
                        <ArrowBackIcon />
                    </IconButton>
                    <PageTitle title={title} />
                    <IconButton sx={{ marginLeft: "auto" }} onClick={() => openEvents()}>
                        <ChevronLeftIcon sx={{ fontSize: "3rem" }} />
                    </IconButton>
                </Toolbar> :
                <AppBar position="static" color="inherit">
                    <Toolbar>
                        <PageTitle title={title} />
                        <IconButton sx={{ marginLeft: "auto" }} onClick={() => openEvents()}>
                            <ChevronLeftIcon sx={{ fontSize: "3rem" }} />
                        </IconButton>
                    </Toolbar>
                </AppBar>
            }
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

const PageTitle = ({ title }) => {
    const theme = useTheme();

    const desktop = useMediaQuery(theme.breakpoints.up('md'));

    if (desktop) {
        return (
            <Typography variant="h6" noWrap>{title}</Typography>
        );
    }
    return (
        <Breadcrumbs>
            <Typography variant="h6" color="textPrimary">{title}</Typography>
        </Breadcrumbs>
    );
};

export default PageLayout;