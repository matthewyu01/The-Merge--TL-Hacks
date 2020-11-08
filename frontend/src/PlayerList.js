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

class PlayeranizationList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            players: {},
            filtered: {},
            menuOpen: null,
            selectedIndex: 0,
            playerIndexStart: 0,
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
            data.append("limit", Constants.MAXIMUM_QUERY_LIMIT);
            fetch(
                `${Constants.LIQUID_API_URL}${Constants.PLAYER_LIST_ENDPOINT}`,
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
                        data.result.forEach((player) => {
                            if (!player.id) {
                                return;
                            }

                            const key = `${player.id.toLowerCase()}-${player.name.toLowerCase()}`;
                            if (!oldState.players[key]) {
                                oldState.players[key] = {
                                    id: player.id,
                                    name: player.romanizedname || player.name,
                                    games: [player.wiki],
                                    logo: player.logourl,
                                    earnings: player.earnings,
                                };
                            } else if (
                                !oldState.players[key].games.includes(
                                    player.wiki
                                )
                            ) {
                                oldState.players[key].games.push(player.wiki);
                                oldState.players[key].earnings +=
                                    player.earnings;
                            }
                        });
                        return oldState;
                    });
                })
                .then(() =>
                    this.setState({
                        filtered: this.state.players,
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

        let newFiltered = this.filterSearch(this.state.players, query);
        let finalFiltered = this.filterGame(
            newFiltered,
            this.state.selectedIndex
        );

        this.setState({
            filtered: finalFiltered,
            searchQuery: query,
            playerIndexStart: 0,
        });
    }

    filterSearch = (playerList, query) => {
        let newFiltered = {};
        if (playerList && query !== "") {
            for (var key of Object.keys(playerList)) {
                if (playerList[key].id.toLowerCase().includes(query)) {
                    newFiltered[key] = playerList[key];
                }
            }
        } else {
            newFiltered = playerList;
        }

        return newFiltered;
    };

    filterGame = (playerList, index) => {
        let newFiltered = {};
        if (index !== 0) {
            let toFilter = Constants.GAMES[index - 1];

            for (var key of Object.keys(playerList)) {
                if (playerList[key].games.includes(toFilter)) {
                    newFiltered[key] = playerList[key];
                }
            }
        } else {
            newFiltered = playerList;
        }

        return newFiltered;
    };

    handleMenuItemClick = (event, index) => {
        let newFiltered = this.filterGame(this.state.players, index);
        let finalFiltered = this.filterSearch(
            newFiltered,
            this.state.searchQuery
        );

        this.setState({
            filtered: finalFiltered,
            selectedIndex: index,
            playerIndexStart: 0,
            menuOpen: null,
        });
    };

    handleClose = () => {
        this.setState({
            menuOpen: null,
        });
    };

    handlePaginationUpdate = (ev, page) => {
        this.setState({
            playerIndexStart: (page - 1) * Constants.PLAYERS_PER_PAGE,
        });
    };

    renderPlayers = () => {
        const players = Object.keys(this.state.filtered).map(
            (key) => this.state.filtered[key]
        );
        return players
            .sort((a, b) => b.earnings - a.earnings)
            .slice(
                this.state.playerIndexStart,
                this.state.playerIndexStart + Constants.PLAYERS_PER_PAGE
            )
            .map((player, i) => {
                return (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        key={`players-${player.id}-${
                            i + this.state.playerIndexStart
                        }`}
                    >
                        <Card variant="outlined">
                            <CardActionArea
                                to={`/players/${player.id}`}
                                component={Link}
                            >
                                <CardContent>
                                    <Typography variant="h6">
                                        {player.id}
                                    </Typography>
                                    <Typography variant="body2">
                                        {player.games
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
        if (!this.state.players) return null;

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
                    placeholder="Search Player"
                    onChange={(event) => this.handleSearch(event)}
                />

                <Pagination
                    count={Math.ceil(
                        Object.keys(this.state.filtered).length /
                            Constants.PLAYERS_PER_PAGE
                    )}
                    page={
                        this.state.playerIndexStart /
                            Constants.PLAYERS_PER_PAGE +
                        1
                    }
                    onChange={this.handlePaginationUpdate}
                ></Pagination>
                <Grid container spacing={2} className={classes.root}>
                    {this.renderPlayers()}
                </Grid>
            </div>
        );
    };
}

export default withStyles(styles)(PlayeranizationList);
