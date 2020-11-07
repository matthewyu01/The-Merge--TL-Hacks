import React from "react";
import { Container } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./Navbar";
import HomePage from "./HomePage";
import OrganizationList from "./OrganizationList";
import PlayerList from "./PlayerList";

export default function App() {
    return (
        <Router>
            <Navbar></Navbar>
            <Container>
                <Switch>
                    <Route path="/organizations">
                        <OrganizationList />
                    </Route>
                    <Route path="/players">
                        <PlayerList />
                    </Route>
                    <Route path="/">
                        <HomePage />
                    </Route>
                </Switch>
            </Container>
        </Router>
    );
}
