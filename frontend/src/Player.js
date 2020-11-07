import React from "react";
import Chart from "react-google-charts";
import { Typography } from "@material-ui/core";
import * as Constants from "./Constants";

class Player extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            info: null,
        };
    }

    componentDidMount() {
        Constants.GAMES.forEach((game) => {

            let data = new FormData();
            data.append("wiki", game);
            data.append("apikey", Constants.LIQUID_API_KEY);
            data.append("limit", Constants.MAXIMUM_QUERY_LIMIT);
            data.append("conditions", `[[player::${this.props.match.params.player}]]`);

            fetch(
                `${Constants.LIQUID_API_URL}${Constants.TRANSFER_LIST_ENDPOINT}`,
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
                    let currInfo = this.state.info;

                    if(!currInfo) currInfo = [];
                    this.setState({
                        info: [...currInfo, ...data.result]
                    });
                })
                .catch((err) => console.log(err));

        })

    }

    filter = () => {
        return this.state.info.filter((player) => {
            return (
                player.extradata.displayname.toLowerCase() ===
                this.props.match.params.player.toLowerCase()
            );
        });
    };

    render = () => {
        if (!this.state.info) return null;

        let { info } = this.state;

        let playerInfo = info;
        playerInfo.sort((a, b) => {
            return Date.parse(b.date) - Date.parse(a.date);
        });

        let timelineData = [];
        timelineData.push([
            { type: "string", id: "Game"},
            { type: "string", id: "Team Name" },
            { type: "date", id: "Start" },
            { type: "date", id: "End" },
        ]);

        let i = playerInfo.length;
        let currDate = Date.now();
        for (var entry of playerInfo) {
            if(entry.toteam === '') {
                timelineData.push([
                    'N/A',
                    '(No Team)',
                    new Date(Date.parse(entry.date)),
                    currDate,
                ]);
            } else {
                timelineData.push([
                    `${Constants.GAMES_PRETTY[entry.wiki]}`,
                    entry.toteam,
                    new Date(Date.parse(entry.date)),
                    currDate,
                ]);
            }

            currDate = new Date(Date.parse(entry.date));
            i--;
        }

        if (timelineData.length === 1) {
            return <Typography variant="h6">No Data Available</Typography>;
        }

        return (
            <div>
                <h1>{this.props.match.params.player}</h1>
                <Chart
                    width={"500px"}
                    height={"300px"}
                    chartType="Timeline"
                    loader={<div>Loading Chart</div>}
                    data={timelineData}
                    options={{
                        timeline: {
                        groupByRowLabel: false,
                        },
                    }}
                />
            </div>
        );
    };
}

export default Player;
