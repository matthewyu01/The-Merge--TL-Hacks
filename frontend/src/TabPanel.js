import React from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {
    Paper,
    Link,
    Table,
    TableCell,
    TableContainer,
    TableRow,
    TableHead,
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
}))(TableCell);

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
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        "aria-controls": `vertical-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: "flex",
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
}));

export default function VerticalTabs({ gameRosters }) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                className={classes.tabs}
            >
                {Object.keys(gameRosters).map((game, i) => {
                    return <Tab label={game} {...a11yProps(i)} />;
                })}
            </Tabs>
            {Object.keys(gameRosters).map((game, i) => {
                return (
                    <TabPanel value={value} index={i}>
                        <TableContainer component={Paper}>
                            <Table key={`table-${game}-${i}`}>
                                <TableHead key={`table-header-${game}-${i}`}>
                                    <StyledTableCell
                                        key={`table-header-player-${game}-${i}`}
                                    >
                                        Player
                                    </StyledTableCell>
                                    <StyledTableCell
                                        key={`table-header-role-${game}-${i}`}
                                    >
                                        Role
                                    </StyledTableCell>
                                    <StyledTableCell
                                        key={`table-header-status-${game}-${i}`}
                                    >
                                        Status
                                    </StyledTableCell>
                                    <StyledTableCell
                                        key={`table-header-nationality-${game}-${i}`}
                                    >
                                        Nationality
                                    </StyledTableCell>
                                    <StyledTableCell
                                        key={`table-header-name-${game}-${i}`}
                                    >
                                        Name
                                    </StyledTableCell>
                                    <StyledTableCell
                                        key={`table-header-age-${game}-${i}`}
                                    >
                                        Age
                                    </StyledTableCell>
                                </TableHead>
                                {gameRosters[game].map((player, j) => (
                                    <TableRow
                                        key={`row-${player.id}-${game}-${i}-${j}`}
                                    >
                                        <TableCell
                                            key={`cell-id-${player.id}-${game}-${i}-${j}`}
                                        >
                                            <Typography>
                                                <Link
                                                    color="inherit"
                                                    to={`/players/${player.id}`}
                                                    component={RouterLink}
                                                >
                                                    {player.id}
                                                </Link>
                                            </Typography>
                                        </TableCell>
                                        <TableCell
                                            key={`cell-role-${player.id}-${game}-${i}-${j}`}
                                        >
                                            {player.extradata?.role ||
                                                "Unknown"}
                                        </TableCell>
                                        <TableCell
                                            key={`cell-status-${player.id}-${game}-${i}-${j}`}
                                        >
                                            {player.status || "Unknown"}
                                        </TableCell>
                                        <TableCell
                                            key={`cell-nationality-${player.id}-${game}-${i}-${j}`}
                                        >
                                            {player.nationality || "Unknown"}
                                        </TableCell>
                                        <TableCell
                                            key={`cell-name-${player.id}-${game}-${i}-${j}`}
                                        >
                                            {player.romanizedname ||
                                                player.name ||
                                                "Unknown"}
                                        </TableCell>
                                        <TableCell
                                            key={`cell-age-${player.id}-${game}-${i}-${j}`}
                                        >
                                            {new Date(
                                                +new Date() -
                                                    +new Date(player.birthdate)
                                            ).getFullYear() - 1970}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </Table>
                        </TableContainer>
                    </TabPanel>
                );
            })}
        </div>
    );
}
