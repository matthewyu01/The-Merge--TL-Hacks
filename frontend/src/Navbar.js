import {
    AppBar,
    Button,
    Typography,
    Toolbar,
    useTheme,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import Switch from "@material-ui/core/Switch";
import IconButton from "@material-ui/core/IconButton";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import NightsStayIcon from "@material-ui/icons/NightsStay";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Tooltip from "@material-ui/core/Tooltip";

function Navbar(props) {
    const theme = useTheme();

    return (
        <AppBar position="static" color={"inherit"}>
            <Toolbar>
                <Typography variant="h6">
                    <Button
                        color="inherit"
                        startIcon={<EmojiPeopleIcon></EmojiPeopleIcon>}
                        component={Link}
                        to="/players"
                    >
                        Players
                    </Button>
                </Typography>
                <Typography variant="h6">
                    <Button
                        color="inherit"
                        component={Link}
                        to="/organizations"
                        startIcon={<PeopleAltIcon></PeopleAltIcon>}
                    >
                        Organizations
                    </Button>
                </Typography>
                <Typography variant="h6" style={{ flex: 1 }}>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/statistics"
                        startIcon={<EqualizerIcon></EqualizerIcon>}
                    >
                        Statistics
                    </Button>
                </Typography>
                <Tooltip title="Night Mode Toggle">
                    <IconButton onClick={props.handleThemeChange}>
                        {props.darkMode ? (
                            <NightsStayIcon />
                        ) : (
                            <Brightness4Icon />
                        )}
                    </IconButton>
                </Tooltip>
                <Switch
                    checked={props.darkMode}
                    onChange={props.handleThemeChange}
                />
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
