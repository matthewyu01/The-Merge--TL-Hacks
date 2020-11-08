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
            })
            
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
                [this.state.games["counterstrike"]?.name, this.state.games["counterstrike"]?.playerCount, '#f8a14d', null],
                [this.state.games["dota2"]?.name, this.state.games["dota2"]?.playerCount, 'darkred', null],
                [this.state.games["rocketleague"]?.name, this.state.games["rocketleague"]?.playerCount, '#3dd94ca', null],
                [this.state.games["pubg"]?.name, this.state.games["pubg"]?.playerCount, 'gold', null],
            ]}
            options={{
                title: 'Live Player Count for Steam Games',
                titleTextStyle: {
                    fontSize: 20,
                    bold: true,
                },
                width: 600,
                height: 250,
                bar: { groupWidth: '95%' },
                legend: { position: 'none' },
                hAxis: {
                    title: 'Active Players',
                    minValue: 0,
                  },
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
    { team_ranking: '0', teamName: 'No info available', amount: 0 },
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
          <TableCell component="th" scope="row">
            {row.name}
          </TableCell>
          <TableCell align="right" style = {{color : "red"}}>{row.player_count}</TableCell>
          <TableCell align="right">{row.twitchViewership}</TableCell>
          <TableCell align="right">{row.totalPrizeEarnings}</TableCell>
          <TableCell align="right">{row.tournamentWins}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  Rankings
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Ranking</TableCell>
                      <TableCell>Team</TableCell>
                      <TableCell align="right">Points</TableCell>
                      <TableCell align="right"># of Trophies</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.rankings.map((rankingsRow) => (
                      <TableRow key={rankingsRow.team_ranking}>
                        <TableCell component="th" scope="row">
                          {rankingsRow.team_ranking}
                        </TableCell>
                        <TableCell>{rankingsRow.teamName}</TableCell>
                        <TableCell align="right">{rankingsRow.amount}</TableCell>
                        <TableCell align="right">
                          {Math.round(rankingsRow.amount * row.price * 100) / 100}
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
          amount: PropTypes.number.isRequired,
          teamName: PropTypes.string.isRequired,
          team_ranking: PropTypes.number.isRequired,
        }),
      ).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      tournamentWins: PropTypes.number.isRequired,
    }).isRequired,
  };
  
  const rows = [
    createData('Counter-Strike: Global Offensive', 1004, 0, "$103,148,629.27", 6288, 3.99),
    createData('Valorant', 0, 0, "$1,369,951.05", 265, 4.99),
    createData('League of Legends', 0, 0, "$81,343,448.94", 2478, 3.79),
    createData('Dota 2', 1004, 0, "$227,914,706.51", 1444, 2.5),
    createData('Overwatch', 0, 0, "$26,049,333.28", 743, 1.5),
  ];
  
class CollapsibleTable extends React.Component {
    render = () => {
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

function HomePage() {
    return (
        <div> 
            <h1>Home Page</h1>
            <PlayerCountGraph/>
            <h3>Esports Pro Team Rankings</h3>
            <CollapsibleTable/>
        </div>
    );
}


  
  

export default HomePage;
