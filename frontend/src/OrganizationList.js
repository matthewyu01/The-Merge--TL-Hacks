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
        fetch(Constants.BACKEND_URL + Constants.ORG_LIST_ENDPOINT)
            .then((response) => response.json())
            .then((data) => this.setState({ orgs: data.orgs }))
            .catch((err) => console.log(err));
    }

    render = () => {
        if (!this.state.orgs) return null;

        const { classes } = this.props;
        return (
            <Grid container spacing={2} className={classes.root}>
                {this.state.orgs.map((org) => (
                    <Grid item xs={6}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6">{org.name}</Typography>
                            </CardContent>{" "}
                        </Card>
                    </Grid>
                ))}
            </Grid>
        );
    };
}

export default withStyles(styles)(OrganizationList);
