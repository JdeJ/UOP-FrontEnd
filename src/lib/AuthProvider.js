import React, { Component } from "react";
import { toast } from 'react-toastify';
import { inject } from 'mobx-react';

import auth from "./auth-service";

import SpinnerCentral from "../components/SpinnerCentral";
import Spinner from "../components/Spinner";

const { Consumer, Provider } = React.createContext();

export { Consumer };

export const withAuth = Comp => {
  return class WithAuth extends Component {
    render() {
      return (
        <Consumer>
          {authStore => {
            return (
              <Comp
                login={authStore.login}
                signup={authStore.signup}
                user={authStore.user}
                logout={authStore.logout}
                isLoggedin={authStore.isLoggedin}
                {...this.props}
              />
            );
          }}
        </Consumer>
      );
    }
  };
};

@inject('appStore')
class AuthProvider extends Component {
  state = {
    isLoggedin: false,
    user: null,
    isLoading: true
  };

  componentDidMount() {
    auth
    .me()
    .then(user => {
      this.setState({
        isLoggedin: true,
        user,
        isLoading: false
      });
      this.props.appStore.me(user);
    })
    .catch((error) => {
      this.setState({
        isLoggedin: false,
        user: null,
        isLoading: false
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isLoggedin !== this.state.isLoggedin){
      this.props.appStore.me(this.state.user);
    }
  }


  signup = user => {
    auth
      .signup(user)
      .then(user => {
        toast.success("User created successfully", {
          position: toast.POSITION.BOTTOM_RIGHT
        });
        this.setState({
          isLoggedin: true,
          user
        });
        toast.info(`Welcome ${user.username}`, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      })
      .catch((error) => {
        toast.error(`Sorry. ${error.response.data.message}`, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      });
  };

  login = user => {
    const { username, password } = user;
    auth
      .login({ username, password })
      .then(user => {
        toast.success("Successfully logged", {
          position: toast.POSITION.BOTTOM_RIGHT
        });
        this.setState({
          isLoggedin: true,
          user
        });
        toast.info(`Welcome ${user.username}`, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      })
      .catch((error) => {
        toast.error(`Sorry. ${error.response.data.message}`, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      });
  };

  logout = () => {
    auth
      .logout()
      .then(() => {
        this.props.appStore.serverSocketLogout();
        toast.info(`See you soon ${this.state.user.username}`, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
        toast.success("Successfully logged out", {
          position: toast.POSITION.BOTTOM_RIGHT
        });
        this.setState({
          isLoggedin: false,
          user: null
        });
      })
      .catch((error) => {
        toast.error(`Sorry. ${error.response.data.message}`, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      });
  };
  render() {
    const { isLoading, isLoggedin, user } = this.state;
    return isLoading ? (
      <SpinnerCentral />
    ) : (
      <Provider
        value={{
          isLoggedin,
          user,
          login: this.login,
          logout: this.logout,
          signup: this.signup
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

export default AuthProvider;