import React from "react";
import { withRouter } from "react-router-dom";

class Organization extends React.Component {
    render = () => {
        const { match } = this.props;
        const { params } = match;
        const { name } = params;
        return <h1>{name}</h1>;
    };
}

export default withRouter(Organization);
