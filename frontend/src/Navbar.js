import { AppBar, Button, Typography, Toolbar } from "@material-ui/core";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

function Navbar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6">
                    <Button color="inherit" component={Link} to="/">
                        Home
                    </Button>
                </Typography>
                <Typography variant="h6">
                    <Button color="inherit" component={Link} to="/">
                        Players
                    </Button>
                </Typography>
                <Typography variant="h6">
                    <Button color="inherit" component={Link} to="/orginzation">
                        Organizations
                    </Button>
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
