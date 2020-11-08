import { Container } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./Navbar";
import HomePage from "./HomePage";
import OrganizationList from "./OrganizationList";
import PlayerList from "./PlayerList";
import Organization from "./Organization";
import Player from "./Player";
import Footer from "./Footer";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import React, { useState } from "react";

export default function App() {
    const [darkMode, setDarkMode] = useState(false);
    const paletteType = darkMode ? "dark" : "light";
    const theme = createMuiTheme({
        palette: {
            type: paletteType,
        },
    });

    const handleThemeChange = () => {
        setDarkMode(!darkMode);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline>
                <Router>
                    <div style={{ position: "relative", minHeight: "100vh" }}>
                        <Navbar
                            darkMode={darkMode}
                            handleThemeChange={handleThemeChange}
                        />
                        <Container style={{ paddingBottom: 96 }}>
                            <Switch>
                                <Route
                                    exact
                                    path="/organizations/:name"
                                    render={(props) => (
                                        <Organization
                                            key={`org-${props.match.params.name}`}
                                            {...props}
                                        />
                                    )}
                                />
                                <Route exact path="/statistics">
                                    <HomePage></HomePage>
                                </Route>
                                <Route exact path="/organizations">
                                    <OrganizationList />
                                </Route>
                                <Route exact path="/players">
                                    <PlayerList />
                                </Route>
                                <Route
                                    exact
                                    path="/players/:player"
                                    render={(props) => (
                                        <Player
                                            key={`player-${props.match.params.player}`}
                                            {...props}
                                        />
                                    )}
                                />
                                <Route
                                    path="/"
                                    render={(props) => (
                                        <OrganizationList {...props} />
                                    )}
                                />
                            </Switch>
                        </Container>
                        <Footer />
                    </div>
                </Router>
            </CssBaseline>
        </ThemeProvider>
    );
}
