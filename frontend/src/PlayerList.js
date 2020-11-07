import { Card, CardContent, Grid, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";

const FAKE_DATA = [
    { name: "Impact" },
    { name: "DoubleLift" },
    { name: "Jensen" },
    { name: "CoreJJ" },
];

const styles = (theme) => ({
    root: {
        marginTop: 12,
    },
});

class PlayerList extends React.Component {
    render = () => {
        const { classes } = this.props;
        return (
            <Grid container spacing={2} className={classes.root}>
                {FAKE_DATA.map((org) => (
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

export default withStyles(styles)(PlayerList);
