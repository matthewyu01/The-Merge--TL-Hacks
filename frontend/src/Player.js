import React from 'react';
import Chart from 'react-google-charts';
import * as Constants from './Constants';

class Player extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            info: null
        };

        this.getData = this.getData.bind(this);
        this.filter = this.filter.bind(this);
    }

    componentDidMount() {

        let data = new FormData();
        data.append("wiki", Constants.GAMES.join("|"));
        data.append("apikey", Constants.LIQUID_API_KEY);
        data.append("limit", Constants.MAXIMUM_QUERY_LIMIT);

        this.getData(true, data, 0);

    }

    getData = (shouldContinue, data, offset) => {

        if(shouldContinue) {
            data.set("offset", offset + Constants.MAXIMUM_QUERY_LIMIT);

            fetch(`${Constants.LIQUID_API_URL}${Constants.TRANSFER_LIST_ENDPOINT}`, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams(data),
            })
                .then((response) => response.json())
                .then((data) => this.setState({ info: data.result }))
                .then(() => this.getData(this.state.info.length >= Constants.MAXIMUM_QUERY_LIMIT, data, offset + Constants.MAXIMUM_QUERY_LIMIT))
                .catch((err) => console.log(err));
        }

    }

    filter = () => {

        return this.state.info.filter((player) => {
            return player.extradata.displayname.toLowerCase() === this.props.match.params.player.toLowerCase();
        });

    }

    render = () => {

        if(!this.state.info)
            return null;

        let playerInfo = this.filter();
        playerInfo.sort((a, b) => {
            return Date.parse(b.date) - Date.parse(a.date);
        });

        let timelineData = [];
        timelineData.push([{ type: 'string', id: 'Team No.' },
                            { type: 'string', id: 'Team Name' },
                            { type: 'date', id: 'Start' },
                            { type: 'date', id: 'End' }]);

        let i = playerInfo.length;
        let currDate = Date.now();
        for(var entry of playerInfo) {

            timelineData.push([i.toString(), entry.toteam, new Date(Date.parse(entry.date)), currDate]);
            currDate = new Date(Date.parse(entry.date));
            i--;

        }

        return (

            <Chart
                width={'500px'}
                height={'300px'}
                chartType="Timeline"
                loader={<div>Loading Chart</div>}
                data={timelineData}
            />

        );

    }

}

export default Player;