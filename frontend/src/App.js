import { Container } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./Navbar";
import HomePage from "./HomePage";
import OrganizationList from "./OrganizationList";
import PlayerList from "./PlayerList";
import Organization from "./Organization";
import Player from "./Player";
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import React, { useState } from "react";

export default function App() {
    const [darkMode, setDarkMode] = useState(false);
    const paletteType = darkMode ? "dark" : "light";
    const theme = createMuiTheme({
        palette: {
        type: paletteType,
        }
    });

    const handleThemeChange = () => {
        setDarkMode(!darkMode);
    };

    return (
        <ThemeProvider theme={theme}> 
            <CssBaseline> 
                <Router>
                    <Navbar darkMode={darkMode} handleThemeChange={handleThemeChange}/>
                    <Container>
                        <Switch>
                            <Route path="/organizations/:name">
                                <Organization />
                            </Route>
                            <Route path="/organizations">
                                <OrganizationList />
                            </Route>
                            <Route exact path="/players">
                                <PlayerList />
                            </Route>
                            <Route exact path="/players/:player" 
                                render={props => <Player {...props} />} />
                            <Route path="/">
                                <HomePage />
                            </Route>
                        </Switch>
                    </Container>
                </Router>
            </CssBaseline> 
        </ThemeProvider>
    );
}
