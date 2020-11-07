import React from "react";
import { Container } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./Navbar";
import HomePage from "./HomePage";
import OrganizationList from "./OrganizationList";

export default function App() {
    return (
        <Router>
            <Navbar></Navbar>
            <Container>
                <Switch>
                    <Route path="/">
                        <HomePage />
                    </Route>
                    <Route path="/organizations">
                        <OrganizationList />
                    </Route>
                </Switch>
            </Container>
        </Router>
    );
}