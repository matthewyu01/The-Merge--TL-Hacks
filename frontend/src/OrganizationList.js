import { Card, CardContent, Typography } from "@material-ui/core";
import React from "react";
import * as Constants from './Constants';

class OrganizationList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            orgs: null
        };
    }

    componentDidMount() {
        fetch(Constants.BACKEND_URL + Constants.ORG_LIST_ENDPOINT)
            .then(response => response.json())
            .then(data => this.setState({ orgs: data.orgs }))
            .catch(err => console.log(err));
    }

    render = () => {
        if(!this.state.orgs)
            return null;

        console.log(this.state);
        return this.state.orgs.map((org, i) => (
            <Card>
                <CardContent>
                    <Typography variant="h4" key={i}>{org.name}</Typography>
                </CardContent>
            </Card>
        ));
    };
}

export default OrganizationList;
