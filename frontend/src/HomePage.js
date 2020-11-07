import React from "react";
import Chart from "react-google-charts";
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

    render = () =>{
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

function HomePage() {
    return (
        <div> 
            <h1>Home Page</h1>
            <PlayerCountGraph/>
        </div>
    );
}

export default HomePage;
