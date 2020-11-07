import {
    Button,
    Card,
    CardContent,
    Grid,
    Menu,
    MenuItem,
    TextField,
    Typography,
    CardActionArea,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
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
            orgIndexStart: 0,
            searchQuery: "",
        };

        this.handleSearch = this.handleSearch.bind(this);
        this.filterSearch = this.filterSearch.bind(this);
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
                                    earnings: org.earnings,
                                };
                            } else if (
                                !oldState.orgs[org.name].games.includes(
                                    org.wiki
                                )
                            ) {
                                oldState.orgs[org.name].games.push(org.wiki);
                                oldState.orgs[org.name].earnings +=
                                    org.earnings;
                            }
                        });
                        return oldState;
                    });
                })
                .then(() =>
                    this.setState({
                        filtered: this.state.orgs,
                    })
                )
                .catch((err) => console.log(err));
        });
    }

    handleClick = (event) => {
        this.setState({
            menuOpen: event.currentTarget,
        });
    };

    handleSearch(event) {
        let query = event.target.value.toLowerCase();

        let newFiltered = this.filterSearch(this.state.orgs, query);
        let finalFiltered = this.filterGame(
            newFiltered,
            this.state.selectedIndex
        );

        this.setState({
            filtered: finalFiltered,
            searchQuery: query,
            orgIndexStart: 0,
        });
    }

    filterSearch = (orgList, query) => {
        let newFiltered = {};
        if (orgList && query !== "") {
            for (var key of Object.keys(orgList)) {
                if (orgList[key].name.toLowerCase().includes(query)) {
                    newFiltered[key] = orgList[key];
                }
            }
        } else {
            newFiltered = orgList;
        }

        return newFiltered;
    };

    filterGame = (orgList, index) => {
        let newFiltered = {};
        if (index !== 0) {
            let toFilter = Constants.GAMES[index - 1];

            for (var key of Object.keys(orgList)) {
                if (orgList[key].games.includes(toFilter)) {
                    newFiltered[key] = orgList[key];
                }
            }
        } else {
            newFiltered = orgList;
        }

        return newFiltered;
    };

    handleMenuItemClick = (event, index) => {
        let newFiltered = this.filterGame(this.state.orgs, index);
        let finalFiltered = this.filterSearch(
            newFiltered,
            this.state.searchQuery
        );

        this.setState({
            filtered: finalFiltered,
            selectedIndex: index,
            orgIndexStart: 0,
            menuOpen: null,
        });
    };

    handleClose = () => {
        this.setState({
            menuOpen: null,
        });
    };

    handlePaginationUpdate = (ev, page) => {
        this.setState({ orgIndexStart: (page - 1) * Constants.ORGS_PER_PAGE });
    };

    renderOrgs = () => {
        const orgs = Object.keys(this.state.filtered).map(
            (key) => this.state.filtered[key]
        );
        return orgs
            .sort((a, b) => b.earnings - a.earnings)
            .slice(
                this.state.orgIndexStart,
                this.state.orgIndexStart + Constants.ORGS_PER_PAGE
            )
            .map((org, i) => {
                return (
                    <Grid
                        item
                        xs={6}
                        key={`orgs-${org.name}-${i + this.state.orgIndexStart}`}
                    >
                        <Card variant="outlined">
                            <CardActionArea
                                to={`/organizations/${org.name}`}
                                component={Link}
                            >
                                <CardContent>
                                    <Typography variant="h6">
                                        {org.name}
                                    </Typography>
                                    <Typography variant="body2">
                                        {org.games
                                            .map(
                                                (name) =>
                                                    Constants.GAMES_PRETTY[name]
                                            )
                                            .join(", ")}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                );
            });
    };

    render = () => {
        if (!this.state.orgs) return null;

        const { classes } = this.props;
        return (
            <div>
                <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={this.handleClick}
                >
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
                        selected={this.state.selectedIndex === 0}
                    >
                        All Games
                    </MenuItem>

                    {Constants.GAMES.map((game, i) => {
                        return (
                            <MenuItem
                                key={i + 1}
                                onClick={(event) =>
                                    this.handleMenuItemClick(event, i + 1)
                                }
                                selected={this.state.selectedIndex === i + 1}
                            >
                                {Constants.GAMES_PRETTY[game]}
                            </MenuItem>
                        );
                    })}
                </Menu>
                <TextField
                    id="standard-basic"
                    placeholder="Search Organizations"
                    onChange={(event) => this.handleSearch(event)}
                />

                <Pagination
                    count={Math.ceil(
                        Object.keys(this.state.filtered).length /
                            Constants.ORGS_PER_PAGE
                    )}
                    onChange={this.handlePaginationUpdate}
                ></Pagination>
                <Grid container spacing={2} className={classes.root}>
                    {this.renderOrgs()}
                </Grid>
            </div>
        );
    };
}

export default withStyles(styles)(OrganizationList);
