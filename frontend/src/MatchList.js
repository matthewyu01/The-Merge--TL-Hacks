import {
    Box,
    Paper,
    Tabs,
    Tab,
    List,
    ListItem,
    Typography,
} from "@material-ui/core";
import { useState } from "react";
import * as Constants from "./Constants";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        "aria-controls": `vertical-tabpanel-${index}`,
    };
}

function MatchList(props) {
    let [value, setValue] = useState(0);

    const { matches } = props;

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Paper>
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="Games"
                centered
            >
                {Object.keys(matches).map((game, i) => {
                    return (
                        <Tab
                            label={Constants.GAMES_PRETTY[game]}
                            {...a11yProps(i)}
                        />
                    );
                })}
            </Tabs>
            {Object.keys(matches).map((game, i) => {
                return (
                    <TabPanel value={value} index={i} style={{ width: "100%" }}>
                        <List>
                            {matches[game]
                                .sort(
                                    (a, b) =>
                                        +new Date(b.date) - +new Date(a.data)
                                )
                                .slice(0, 5)
                                .map((match, j) => (
                                    <ListItem alignItems="flex-start">
                                        <Typography
                                            style={{ marginRight: "auto" }}
                                            variant="h6"
                                        >{`${new Date(
                                            match.date
                                        ).getUTCMonth()}/${new Date(
                                            match.date
                                        ).getDate()}`}</Typography>
                                        <Typography
                                            style={{ margin: "auto" }}
                                            variant="h5"
                                        >
                                            {match.opponent1} v.{" "}
                                            {match.opponent2}
                                        </Typography>
                                        <Typography
                                            style={{
                                                marginLeft: "auto",
                                                fontWeight: "700",
                                            }}
                                            variant="h6"
                                        >
                                            {match.opponent1score}-
                                            {match.opponent2score}
                                        </Typography>
                                    </ListItem>
                                ))}
                        </List>
                    </TabPanel>
                );
            })}
        </Paper>
    );
}

export default MatchList;
