import { Card, CardContent, Grid, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import * as Constants from './Constants';

const styles = (theme) => ({
    root: {
        marginTop: 12,
    },
});

class PlayerList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            players: null
        };
    }

    componentDidMount() {
        fetch(Constants.BACKEND_URL + Constants.PLAYER_LIST_ENDPOINT)
            .then(response => response.json())
            .then(data => this.setState({ players: data.players }))
            .catch(err => console.log(err));
    }

    render = () => {
        if(!this.state.players)
            return null;

        const { classes } = this.props;

        return (
            <Grid container spacing={2} className={classes.root}>
                {this.state.players.map((player, i) => (
                    <Grid item xs={6} key={i}>
                        <Card variant="outlined" key={i}>
                            <CardContent>
                                <Typography variant="h6" key={i}>{player.name}</Typography>
                            </CardContent>{" "}
                        </Card>
                    </Grid>
                ))}
            </Grid>
        );
    };
}

export default withStyles(styles)(PlayerList);
