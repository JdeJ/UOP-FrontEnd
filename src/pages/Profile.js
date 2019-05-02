import React, { Component } from "react";

import { withAuth } from "../lib/AuthProvider";
import Navbar from "../components/Navbar"

class Profile extends Component {
  render() {
    const { user } = this.props
    return (
      <div>
        <Navbar/>
        <h2>Hey {user.username}</h2>
        { user.description ? (
          <div>
            <p>Your description {user.description}</p>
            <p>Those are your stadistics</p>
          </div>
        ) : (
          <div>
            <p>You should upload a description</p>
            <p>Those are your stadistics</p>
          </div>
        )}
      </div>
    );
  }
}

export default withAuth(Profile);