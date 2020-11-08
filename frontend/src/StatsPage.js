import React from "react";
import Chart from "react-google-charts";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import * as Constants from "./Constants";
import { withTheme } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import GetAppIcon from '@material-ui/icons/GetApp';
import RedditIcon from '@material-ui/icons/Reddit';
import EqualizerIcon from '@material-ui/icons/Equalizer';

class PlayerCountGraph extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            games: {},
            playerCountRetrieved: false,
        };
    }

    componentDidMount() {
        Constants.STEAM_GAMES.forEach((game) => {
            var game_steam_id = Constants.STEAM_GAME_IDS[game];

            fetch(
                // '${Constants.STEAMPOWERED_API_URL}${Constants.STEAM_PLAYERCOUNT_ENDPOINT}'
                'https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?format=json&appid=' + game_steam_id,
                {
                    method: "GET",
                    mode: "cors",
                }
            )
                .then(response => response.json())
                .then((data) => {
                    this.setState((oldState) => {
                        oldState.games[game] = {
                            name: Constants.GAMES_PRETTY[game],
                            playerCount: data.response.player_count,
                        }
                        oldState.playerCountRetrieved = true;
                        return oldState;
                    });
                });

        });
    }

    render = () => {
        if (!this.state.playerCountRetrieved) return null;

        return (<Chart
            width={'500px'}
            height={'300px'}
            chartType="BarChart"
            loader={<div>Loading Chart</div>}
            data={[
                [
                    'Game',
                    'Player Count',
                    { role: 'style' },
                    {
                        sourceColumn: 0,
                        role: 'annotation',
                        type: 'string',
                        calc: 'stringify',
                    },
                ],
                [this.state.games["counterstrike"]?.name, this.state.games["counterstrike"]?.playerCount, '#FFB030', null],
                [this.state.games["dota2"]?.name, this.state.games["dota2"]?.playerCount, '#E3407E', null],
                [this.state.games["rocketleague"]?.name, this.state.games["rocketleague"]?.playerCount, '#525BFA', null],
                [this.state.games["pubg"]?.name, this.state.games["pubg"]?.playerCount, '#FAF651', null],
            ]}
            options={{
                title: 'Live Player Count for Steam Games',
                titleTextStyle: {
                    fontSize: 20,
                    bold: true,
                    color: this.props.theme.palette.text.primary
                },
                width: 600,
                height: 250,
                bar: { groupWidth: '55%' },
                legend: { position: 'none' },
                hAxis: {
                    title: 'Active Players',
                    titleTextStyle: {
                        color: this.props.theme.palette.text.primary
                    },
                    minValue: 0,
                    textStyle: {
                        color: this.props.theme.palette.text.primary
                    },
                },
                vAxis: {
                    textStyle: {
                        color: this.props.theme.palette.text.primary
                    },
                },
                backgroundColor: this.props.theme.palette.background.default,
            }}
        />)
    }
};

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
    header: {
        fontWeight: "bold",
        fontSize: 16,
    },
    rankingTable: {
        width: "60%",
    },
    cell: {
        padding: "12px",
    }
});

function createData(name, player_count, dateCreated, totalPrizeEarnings, tournamentWins, price, rankings = [
    { teamRanking: 0, teamName: 'No info available', points: 0, earnings: 0, location: "N/A" },]) {

    return {
        name,
        player_count,
        dateCreated,
        totalPrizeEarnings,
        tournamentWins,
        price,
        rankings,
    };
}

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row" className={classes.header}>
                    {row.name}
                </TableCell>
                <TableCell align="right">{row.player_count}</TableCell>
                <TableCell align="right">{row.dateCreated}</TableCell>
                <TableCell align="right">{row.totalPrizeEarnings}</TableCell>
                <TableCell align="right">{row.tournamentWins}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography align="center" variant="h6" gutterBottom component="div" style={{ color: "#7FFFD4" }}>
                                Rankings
                </Typography>
                            <Table size="small" className={classes.rankingTable} aria-label="purchases" align="center">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.header}>Overall</TableCell>
                                        <TableCell className={classes.header}>Team</TableCell>
                                        <TableCell className={classes.header} align="right">Points</TableCell>
                                        <TableCell className={classes.header} align="right">Earnings</TableCell>
                                        <TableCell className={classes.header} align="right">Location</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.rankings.map((rankingsRow) => (
                                        <TableRow key={rankingsRow.teamRanking} >
                                            <TableCell className={classes.cell} component="th" scope="row">
                                                {rankingsRow.teamRanking}
                                            </TableCell>
                                            <TableCell>{rankingsRow.teamName}</TableCell>
                                            <TableCell align="right">{rankingsRow.points}</TableCell>
                                            <TableCell align="right">{rankingsRow.earnings}</TableCell>
                                            <TableCell align="right">{rankingsRow.location}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        player_count: PropTypes.number.isRequired,
        totalPrizeEarnings: PropTypes.string.isRequired,
        dateCreated: PropTypes.string.isRequired,
        rankings: PropTypes.arrayOf(
            PropTypes.shape({
                points: PropTypes.number.isRequired,
                teamName: PropTypes.string.isRequired,
                teamRanking: PropTypes.number.isRequired,
                earnings: PropTypes.string.isRequired,
                location: PropTypes.string.isRequired,
            }),
        ).isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        tournamentWins: PropTypes.number.isRequired,
    }).isRequired,
};

class CollapsibleTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            gamesArray: {},
            rankingsRetrieved: {
                "valorant": false,
                "counterstrike": false,
                "leagueoflegends": false,
                "dota2": false,
                "overwatch": false,
            },
            detailedInfo: {},
            games: {},
            playerCountRetrieved: false,
        };

        this.getDetailedTeamInfo = this.getDetailedTeamInfo.bind(this);
    }

    componentDidMount() {
        Constants.RANKINGS_GAMES.forEach((game) => {

            fetch(
                `${Constants.BACKEND_URL}${Constants.RANKINGS_ENDPOINT}${game}`,
                {
                    method: "GET",
                    mode: "cors",
                }
            )
                .then(response => response.json())
                .then((data) => {
                    this.setState((oldState) => {
                        oldState.gamesArray[game] = {
                            name: Constants.GAMES_PRETTY[game],
                            rankingsArray: data,
                        }
                    }, this.getDetailedTeamInfo(game, data));
                })
                .catch((err) => console.log(err));
        });

        Constants.STEAM_GAMES.forEach((game) => {
            var game_steam_id = Constants.STEAM_GAME_IDS[game];

            fetch(
                'https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?format=json&appid=' + game_steam_id,
                {
                    method: "GET",
                    mode: "cors",
                }
            )
                .then(response => response.json())
                .then((data) => {
                    this.setState((oldState) => {
                        oldState.games[game] = {
                            name: Constants.GAMES_PRETTY[game],
                            playerCount: data.response.player_count,
                        }
                        oldState.playerCountRetrieved = true;
                        return oldState;
                    });
                });
        });
    }

    getDetailedTeamInfo = (game, rankingData) => {

        let params = new FormData();
        params.append("wiki", game);
        params.append("apikey", Constants.LIQUID_API_KEY);
        params.append("limit", Constants.MAXIMUM_QUERY_LIMIT);

        let detailedInfo = [];
        rankingData.forEach((entry) => {

            params.set("conditions", `[[name::${entry.Team}]]`);
            fetch(
                `${Constants.LIQUID_API_URL}${Constants.TEAM_LIST_ENDPOINT}`,
                {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams(params),
                }
            )
                .then(response => response.json())
                .then((data) => {
                    var teamData = entry;
                    if(data.result.length > 0) {
                        teamData.Location = data.result[0].location;
                        teamData.Earnings = data.result[0].earnings;
                    }
                    else {
                        teamData.Location = "N/A";
                        teamData.Earnings = "N/A";
                    }

                    detailedInfo.push(teamData);
                    detailedInfo.sort((a, b) => {
                        return a.Ranking - b.Ranking;
                    });

                    this.setState((oldState) => {
                        oldState.detailedInfo[game] = detailedInfo;
                        return oldState;
                    });
                })
                .catch((err) => console.log(err));

        });

        this.setState((oldState) => {
            oldState.rankingsRetrieved[game] = true;
        });

    }

    render = () => {

        if (!this.state.rankingsRetrieved["counterstrike"] || 
            !this.state.rankingsRetrieved["valorant"]) 
            return null;

        if (!this.state.playerCountRetrieved) return null;

        var cs_rankings = this.state.detailedInfo["counterstrike"];
        var val_rankings = this.state.detailedInfo["valorant"];

        if(!cs_rankings || !val_rankings)
            return null;

        var cs_array = [];
        var val_array = [];

        cs_rankings.forEach((entry) => {
            cs_array.push({
                teamRanking: entry.Ranking,
                teamName: entry.Team,
                points: entry.Points,
                earnings: entry.Earnings,
                location: entry.Location,
            })
        });

        val_rankings.forEach((entry) => {
            val_array.push({
                teamRanking: entry.Ranking,
                teamName: entry.Team,
                points: entry.Points,
                earnings: entry.Earnings,
                location: entry.Location,
            })
        });

        var rows = [
            createData('Counter-Strike: Global Offensive', this.state.games["counterstrike"]?.playerCount, "August 21, 2012", "$103,148,629.27", 6288, 3.99, cs_array),
            createData('Valorant', 0, "June 2, 2020", "$1,369,951.05", 265, 4.99, val_array),
            createData('League of Legends', 0, "October 27, 2009", "$81,343,448.94", 2478, 3.79),
            createData('Dota 2', this.state.games["dota2"]?.playerCount, "July 9, 2013", "$227,914,706.51", 1444, 2.5),
            createData('Overwatch', 0, "May 24, 2016", "$26,049,333.28", 743, 1.5),
        ];

        return (
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ fontWeight: "bold", fontSize: 20 }} />
                            <TableCell style={{ fontWeight: "bold", fontSize: 20 }}>Game</TableCell>
                            <TableCell style={{ fontWeight: "bold", fontSize: 20 }} align="right">Player Count</TableCell>
                            <TableCell style={{ fontWeight: "bold", fontSize: 20 }} align="right">Date Released</TableCell>
                            <TableCell style={{ fontWeight: "bold", fontSize: 20 }} align="right">Total Prize Earnings</TableCell>
                            <TableCell style={{ fontWeight: "bold", fontSize: 20 }} align="right"># of Tournaments</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <Row key={row.name} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}

function StatsPage(props) {
    return (
        <div>
            <Typography variant="h1" align="center">Statistics</Typography>
            <PlayerCountGraph {...props}/>
            <CollapsibleTable/>
            <i><h5>Click dropdowns for team rankings. Note: Valorant rankings are for NA</h5></i>
            <div style={{fontSize:"16px", fontWeight:"bold",}} align="center">
                CS:GO
                <Tooltip title="Download CS:GO">
                    <IconButton href="https://store.steampowered.com/app/730/CounterStrike_Global_Offensive/">
                        <GetAppIcon/>
                    </IconButton>
                </Tooltip> 
                <Tooltip title="HLTV">
                    <IconButton href="https://www.hltv.org/">
                        <EqualizerIcon/>
                    </IconButton>
                </Tooltip> 
                <Tooltip title="CS:GO Reddit">
                    <IconButton href="https://www.reddit.com/r/GlobalOffensive/" style={{color:"#FF4500"}}>
                        <RedditIcon/>
                    </IconButton>
                </Tooltip> 
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                Valorant
                <Tooltip title="Download Valorant">
                    <IconButton href="https://playvalorant.com/en-us/">
                        <GetAppIcon/>
                    </IconButton>
                </Tooltip> 
                <Tooltip title="theSpike.gg">
                    <IconButton href="https://www.thespike.gg/">
                        <EqualizerIcon/>
                    </IconButton>
                </Tooltip> 
                <Tooltip title="Valorant Reddit">
                    <IconButton href="https://www.reddit.com/r/Valorant/"  style={{color:"#FF4500"}}>
                        <RedditIcon/>
                    </IconButton>
                </Tooltip> 
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                League
                    <Tooltip title="Download LoL">
                        <IconButton href="https://leagueoflegends.com/">
                            <GetAppIcon/>
                        </IconButton>
                    </Tooltip> 
                    <Tooltip title="GoL Esports">
                        <IconButton href="https://gol.gg/tournament/tournament-stats/LPL%20Regional%20Finals%202020/">
                            <EqualizerIcon/>
                        </IconButton>
                    </Tooltip> 
                    <Tooltip title="LoL Reddit">
                        <IconButton href="https://www.reddit.com/r/leagueoflegends/"  style={{color:"#FF4500"}}>
                            <RedditIcon/>
                        </IconButton>
                    </Tooltip> 
                <br></br>
                Dota 2
                    <Tooltip title="Download Dota 2">
                        <IconButton href="https://store.steampowered.com/app/570/Dota_2/">
                            <GetAppIcon/>
                        </IconButton>
                    </Tooltip> 
                    <Tooltip title="DOTABUFF">
                        <IconButton href="https://www.dotabuff.com/">
                            <EqualizerIcon/>
                        </IconButton>
                    </Tooltip> 
                    <Tooltip title="Dota 2 Reddit">
                        <IconButton href="https://www.reddit.com/r/DotA2/"  style={{color:"#FF4500"}}>
                            <RedditIcon/>
                        </IconButton>
                    </Tooltip> 
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                Overwatch
                    <Tooltip title="Download Overwatch">
                        <IconButton href="https://playoverwatch.com/">
                            <GetAppIcon/>
                        </IconButton>
                    </Tooltip> 
                    <Tooltip title="OWL Stats">
                        <IconButton href="https://overwatchleague.com/stats">
                            <EqualizerIcon/>
                        </IconButton>
                    </Tooltip> 
                    <Tooltip title="Overwatch Reddit">
                        <IconButton href="https://www.reddit.com/r/Overwatch/"  style={{color:"#FF4500"}}>
                            <RedditIcon/>
                        </IconButton>
                    </Tooltip> 
            </div>
        </div>
    );
}

export default withTheme(StatsPage);
