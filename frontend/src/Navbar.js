import { AppBar, Button, Typography, Toolbar } from "@material-ui/core";
import { Link } from "react-router-dom";

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
                    <Button color="inherit" component={Link} to="/players">
                        Players
                    </Button>
                </Typography>
                <Typography variant="h6">
                    <Button
                        color="inherit"
                        component={Link}
                        to="/organizations"
                    >
                        Organizations
                    </Button>
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
