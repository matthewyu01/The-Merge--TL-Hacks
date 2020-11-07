import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav>
            <Button color="primary" component={Link} to="/">
                Home
            </Button>
            <Button color="primary" component={Link} to="/about">
                About
            </Button>
            <Button color="primary" component={Link} to="/users">
                Users
            </Button>
        </nav>
    );
}

export default Navbar;
