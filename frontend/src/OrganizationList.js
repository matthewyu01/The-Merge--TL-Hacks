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
            orgs: {},
        };
    }

    componentDidMount() {
        Constants.GAMES.forEach((game) => {
            let data = new FormData();
            data.append("wiki", game);
            data.append("apikey", Constants.LIQUID_API_KEY);
            data.append("limit", "5000");
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
                    this.setState((oldState) => {
                        data.result.forEach((org) => {
                            if (!oldState.orgs[org.name]) {
                                oldState.orgs[org.name] = {
                                    name: org.name,
                                    games: [org.wiki],
                                    logo: org.logourl,
                                };
                            } else if (
                                !oldState.orgs[org.name].games.includes(
                                    org.wiki
                                )
                            ) {
                                oldState.orgs[org.name].games.push(org.wiki);
                            }
                        });
                        return oldState;
                    });
                })
                .catch((err) => console.log(err));
        });
    }

    render = () => {
        if (!this.state.orgs) return null;

        const { classes } = this.props;
        return (
            <Grid container spacing={2} className={classes.root}>
                {Object.keys(this.state.orgs).map((key, i) => {
                    const org = this.state.orgs[key];
                    return (
                        <Grid item xs={6} key={`orgs-${org.name}-${i}`}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6">
                                        {org.name}
                                    </Typography>
                                    <Typography variant="body2">
                                        {org.games.join(", ")}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        );
    };
}

export default withStyles(styles)(OrganizationList);
