import {
    Button,
    Card,
    CardContent,
    Grid,
    Menu,
    MenuItem,
    Typography,
    CardActionArea,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import { Link } from "react-router-dom";
import * as Constants from "./Constants";

const styles = (theme) => ({
    root: {
        marginTop: 12,
    },
});

class OrganizationList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            orgs: {},
            filtered: {},
            menuOpen: null,
            selectedIndex: 0,
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        Constants.GAMES.forEach((game) => {
            let data = new FormData();
            data.append("wiki", game);
            data.append("apikey", Constants.LIQUID_API_KEY);
            data.append("limit", "50");
            fetch(
                `${Constants.LIQUID_API_URL}${Constants.TEAM_LIST_ENDPOINT}`,
                {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams(data),
                }
            )
                .then((response) => response.json())
                .then((data) => {
                    this.setState((oldState) => {
                        data.result.forEach((org) => {
                            if (!oldState.orgs[org.name]) {
                                oldState.orgs[org.name] = {
                                    name: org.name,
                                    games: [org.wiki],
                                    logo: org.logourl,
                                };
                            } else if (
                                !oldState.orgs[org.name].games.includes(
                                    org.wiki
                                )
                            ) {
                                oldState.orgs[org.name].games.push(org.wiki);
                            }
                        });
                        console.log(oldState);
                        console.log(data);
                        return oldState;
                    });
                })
                .then(() => this.setState({
                    filtered: this.state.orgs
                }))
                .catch((err) => console.log(err));
        });
    }

    handleClick = (event) => {
        this.setState({
            menuOpen: event.currentTarget
        });
    }

    handleMenuItemClick = (event, index) => {
        if(index === 0) {
            this.setState({
                filtered: this.state.orgs,
                selectedIndex: 0,
                menuOpen: null
            });
        } else {
            let newFiltered = {};
            let toFilter = Constants.GAMES[index-1];

            for (var key of Object.keys(this.state.orgs)) {
                if(this.state.orgs[key].games.includes(toFilter)) {
                    newFiltered[key] = this.state.orgs[key];
                }
            }

            this.setState({
                filtered: newFiltered,
                selectedIndex: index,
                menuOpen: null
            })

            console.log(newFiltered);
        }
        
    };

    handleClose = () => {
        this.setState({
            menuOpen: null
        })
    }

    render = () => {
        if (!this.state.orgs) return null;

        const { classes } = this.props;
        return (
            <div>
                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
                    Filter by Game
                </Button>
                <Menu
                    anchorEl={this.state.menuOpen}
                    keepMounted
                    open={Boolean(this.state.menuOpen)}
                    onClose={this.handleClose}
                >
                    <MenuItem 
                        key={0} 
                        onClick={(event) => this.handleMenuItemClick(event, 0)} 
                        selected={this.state.selectedIndex === 0}>
                        All Games
                    </MenuItem>
                    {Constants.GAMES.map((game, i) => {
                        return <MenuItem 
                                    key={i+1}
                                    onClick={(event) => this.handleMenuItemClick(event, i+1)} 
                                    selected={this.state.selectedIndex === i+1}>
                                    {game}
                                </MenuItem>;
                    })}
                </Menu>
                <Grid container spacing={2} className={classes.root}>
                    {Object.keys(this.state.filtered).map((key, i) => {
                        const org = this.state.filtered[key];
                        return (
                            <Grid item xs={6} key={`orgs-${org.name}-${i}`}>
                                <Card variant="outlined">
                                    <Link
                                        to={`/organizations/${org.name}`}
                                        component={CardActionArea}
                                    >
                                        <CardContent>
                                            <Typography variant="h6">
                                                {org.name}
                                            </Typography>
                                            <Typography variant="body2">
                                                {org.games.join(", ")}
                                            </Typography>
                                        </CardContent>
                                    </Link>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </div>
        );
    };
}

export default withStyles(styles)(OrganizationList);
