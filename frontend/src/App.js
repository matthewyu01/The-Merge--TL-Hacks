import React from "react";
import { Container } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./Navbar";
import HomePage from "./HomePage";

export default function App() {
    return (
        <Router>
            <Navbar></Navbar>
            <Container>
                <Switch>
                    <Route path="/">
                        <HomePage />
                    </Route>
                </Switch>
            </Container>
        </Router>
    );
}
