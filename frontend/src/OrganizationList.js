import { Card, CardContent, Grid, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import * as Constants from "./Constants";

const styles = (theme) => ({
    root: {
        marginTop: 12,
    },
});

class OrganizationList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            orgs: null,
        };
    }

    componentDidMount() {
        let data = new FormData();
        data.append("wiki", Constants.GAMES);
        data.append("apikey", Constants.LIQUID_API_KEY);
        fetch(`${Constants.LIQUID_API_URL}${Constants.TEAM_LIST_ENDPOINT}`, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(data),
        })
            .then((response) => response.json())
            .then((data) => this.setState({ orgs: data.result }))
            .catch((err) => console.log(err));
    }

    render = () => {
        if (!this.state.orgs) return null;

        const { classes } = this.props;
        return (
            <Grid container spacing={2} className={classes.root}>
                {this.state.orgs.map((org, i) => (
                    <Grid item xs={6} key={`orgs-${org.name}-${i}`}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6">{org.name}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        );
    };
}

export default withStyles(styles)(OrganizationList);
