import { Card, CardContent, Typography } from "@material-ui/core";
import React from "react";

const FAKE_DATA = [
    { name: "Team Liquid" },
    { name: "Team Solo Mid" },
    { name: "Couter Logic Gamer" },
    { name: "G2" },
];

class OrganizationList extends React.Component {
    render = () => {
        return FAKE_DATA.map((org) => (
            <Card>
                <CardContent>
                    <Typography variant="h4">{org.name}</Typography>
                </CardContent>
            </Card>
        ));
    };
}

export default OrganizationList;
