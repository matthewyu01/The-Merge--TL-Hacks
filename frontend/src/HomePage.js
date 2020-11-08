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
import RedditIcon from '@material-ui/icons/Reddit';

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
  });
  
  function createData(name, player_count, twitchViewership, totalPrizeEarnings, tournamentWins, price, rankings = [
    { teamRanking: 0, teamName: 'No info available', points: 0 },
  ]) 
  {

    return {
      name,
      player_count,
      twitchViewership,
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
          <TableCell component="th" scope="row" style = {{fontWeight : "bold", fontSize : 20}}>
            {row.name}
          </TableCell>
          <TableCell align="right">{row.player_count}</TableCell>
          <TableCell align="right">{row.twitchViewership}</TableCell>
          <TableCell align="right">{row.totalPrizeEarnings}</TableCell>
          <TableCell align="right">{row.tournamentWins}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div" style = {{color : "#7FFFD4"}}>
                  Rankings
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Team</TableCell>
                      <TableCell align="right">Points</TableCell>
                      <TableCell align="right"># of Trophies</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.rankings.map((rankingsRow) => (
                      <TableRow key={rankingsRow.teamRanking}>
                        <TableCell component="th" scope="row">
                          {rankingsRow.teamRanking}
                        </TableCell>
                        <TableCell>{rankingsRow.teamName}</TableCell>
                        <TableCell align="right">{rankingsRow.points}</TableCell>
                        <TableCell align="right">
                          {Math.round(rankingsRow.points * row.price * 100) / 100}
                        </TableCell>
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
      twitchViewership: PropTypes.number.isRequired,
      rankings: PropTypes.arrayOf(
        PropTypes.shape({
          points: PropTypes.number.isRequired,
          teamName: PropTypes.string.isRequired,
          teamRanking: PropTypes.number.isRequired,
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
        }
    };
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
                    oldState.rankingsRetrieved[game] = true;
                    return oldState;
                });
            });
    });
}   


    render = () => {
        if (!this.state.rankingsRetrieved["counterstrike"]) return null;
        else if (!this.state.rankingsRetrieved["valorant"]) return null;

        var cs_rankings = this.state.gamesArray["counterstrike"].rankingsArray;
        //var val_rankings = this.state.gamesArray["valorant"].rankingsArray;

        var cs_array = [];

        for (var index = 0; index < cs_rankings.length; index++){
            cs_array.push({teamRanking: cs_rankings[index].Ranking, 
                            teamName: cs_rankings[index].Team, 
                            points: cs_rankings[index].Points});
            // output is chars from str

        }

        
        var val_array = [{ teamRanking: 0, teamName: 'No info available', points: 0 }];

        var rows = [
        createData('Counter-Strike: Global Offensive', 1004, 0, "$103,148,629.27", 6288, 3.99, cs_array),
        createData('Valorant', 0, 0, "$1,369,951.05", 265, 4.99),
        createData('League of Legends', 0, 0, "$81,343,448.94", 2478, 3.79),
        createData('Dota 2', 1004, 0, "$227,914,706.51", 1444, 2.5),
        createData('Overwatch', 0, 0, "$26,049,333.28", 743, 1.5),
      ];
        return (
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Game</TableCell>
              <TableCell align="right">Player Count</TableCell>
              <TableCell align="right">Twitch Viewership</TableCell>
              <TableCell align="right">Total Prize Earnings</TableCell>
              <TableCell align="right"># of Tournaments</TableCell>
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

function HomePage(props) {
    return (
        <div> 
            <Typography variant="h1" align="center">Statistics</Typography>
            <PlayerCountGraph {...props}/>
            <h3>Esports Pro Team Rankings</h3>
            <CollapsibleTable/>
            {/* <Tooltip title="CSGO Reddit">
                <IconButton href="https://www.reddit.com/r/GlobalOffensive/">
                    <RedditIcon/>
                </IconButton>
            </Tooltip> */}
        </div>
    );
}

export default withTheme(HomePage);
