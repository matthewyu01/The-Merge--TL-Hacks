import React from "react";
import Chart from "react-google-charts";
import * as Constants from "./Constants";
import { Typography } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { withTheme } from "@material-ui/core/styles";
import VerticalTabs from "./TabPanel";

class Organization extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            info: [],
            gameRosters: {},
        };
    }

    componentDidMount() {
        Constants.GAMES.forEach((game) => {
            let data = new FormData();
            data.append("wiki", game);
            data.append("apikey", Constants.LIQUID_API_KEY);
            data.append("limit", Constants.MAXIMUM_QUERY_LIMIT);
            data.append(
                "conditions",
                `[[name::${this.props.match.params.name}]]`
            );

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
                    let currInfo = this.state.info;
                    this.setState({
                        info: [...currInfo, ...data.result],
                    });
                })
                .catch((err) => console.log(err));

            data.set("conditions", `[[team::${this.props.match.params.name}]]`);
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
                    let players = [];
                    data.result.forEach((player) => {
                        players.push(player);
                    });

                    if (players.length > 0) {
                        let currRoster = this.state.gameRosters;
                        currRoster[Constants.GAMES_PRETTY[game]] = players;
                        this.setState({
                            gameRosters: currRoster,
                        });
                    }
                })
                .catch((err) => console.log(err));
        });
    }

    render = () => {
        if (this.state.info.length === 0) return null;

        let { info } = this.state;

        let orgInfo = info.sort((a, b) => {
            return Date.parse(b.date) - Date.parse(a.date);
        });

        let timelineData = [];
        timelineData.push([
            { type: "string", id: "Index" },
            { type: "string", id: "Game" },
            { type: "date", id: "Start" },
            { type: "date", id: "End" },
        ]);

        for (var entry of orgInfo) {
            let startDate = Date.parse(entry.createdate);
            if (startDate < new Date(2000, 1, 1))
                startDate = new Date(2000, 1, 1);

            let endDate = Date.parse(entry.disbanddate);
            if (endDate === 0) endDate = Date.now();

            timelineData.push([
                Constants.GAMES_PRETTY[entry.wiki],
                Constants.GAMES_PRETTY[entry.wiki],
                startDate,
                endDate,
            ]);
        }

        if (timelineData.length === 1) {
            return <Typography variant="h6">No Data Available</Typography>;
        }

        let primaryColor = this.props.theme.palette.text.primary;
        let backgroundColor = this.props.theme.palette.background;

        return (
            <div>
                <h1>{this.props.match.params.name}</h1>
                <img 
                    src={`${Constants.BACKEND_URL}${Constants.LOGOS_ENDPOINT}${this.props.match.params.name}`} 
                    alt={`${this.props.match.params.name} Logo`}
                />
                
                <Chart
                    width={"500px"}
                    height={"300px"}
                    chartType="Timeline"
                    loader={<div>Loading Chart</div>}
                    data={timelineData}
                    options={{
                        timeline: {
                            groupByRowLabel: false,
                            rowLabelStyle: {
                                color: primaryColor,
                            },
                            barLabelStyle: {
                                color: primaryColor,
                            },
                            showBarLabels: false,
                        },
                        backgroundColor: backgroundColor.paper,
                    }}
                    chartEvents={[
                        {
                            eventName: "ready",
                            callback: () => {
                                var labels = document.getElementsByTagName(
                                    "text"
                                );
                                Array.prototype.forEach.call(labels, function (
                                    label
                                ) {
                                    if (
                                        label.getAttribute("text-anchor") ===
                                        "middle"
                                    ) {
                                        label.setAttribute(
                                            "fill",
                                            primaryColor
                                        );
                                    }
                                });
                            },
                        },
                    ]}
                />
                <VerticalTabs gameRosters={this.state.gameRosters} />
            </div>
        );
    };
}

export default withRouter(withTheme(Organization));
