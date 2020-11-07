import React from "react";
import Chart from "react-google-charts";
import * as Constants from "./Constants";

function HomePage() {

    let data = new FormData();
    var game_steam_id = "730"
    data.append("appid", game_steam_id);

    fetch(
        'https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?format=json&appid=730',
        {
            method: "GET",
            mode: "cors",
        }
    )
        .then(response => response.json())
        .then(data => console.log(data));
    
    // .then((response) => response.json())
    // console.log(data.result)
    return (
        //{Constants.GAMES_PRETTY[game]}
        <div> 
            <h1>Home Page</h1>
            <Chart
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
                    ['CSGO', 700000, '#f8a14d', null],
                    ['Dota 2', 600000, 'darkred', null],
                ]}
                options={{
                    title: 'Live Player Count',
                    width: 600,
                    height: 200,
                    bar: { groupWidth: '95%' },
                    legend: { position: 'none' },
                    hAxis: {
                        title: 'Active Players',
                        minValue: 0,
                      },
                }}
                />
        </div>
);
    
}

export default HomePage;
