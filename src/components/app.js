import React, { Component, createContext } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import Cookies from "js-cookie"

import Auth from './pages/auth';
import Home from './pages/home';

export const UserContext = createContext({})

export default class App extends Component {
  constructor() {
    super()

    this.state = {
      user: {},
      loading: true
    }

    this.setUser = this.setUser.bind(this)
    this.logoutUser = this.logoutUser.bind(this)
  }

  setUser(newUser) {
    this.setState({ user: newUser })
  }

  logoutUser() {
    const token = Cookies.get("token")
    Cookies.remove("token")
    this.setState({
      user: {},
      loading: true
    })
    fetch(`https://whatsfordinnerapi.herokuapp.com/user/logout/single/${token}`, { method: "DELETE" })
    .then(response => response.json())
    .then(data => {
      if (data.status === 200) {
        this.setState({ loading: false })
      }
      else {
        console.log(data)
      }
    })
    .catch(error => console.log(error))
  }

  componentDidMount() {
    const token = Cookies.get("token")
    if (token) {
      fetch(`https://whatsfordinnerapi.herokuapp.com//user/get/token/${token}`)
      .then(response => response.json())
      .then(data => {
        if (data.status === 403) {
          Cookies.remove("token")
        }
        else if (data.status === 200) {
          this.setState({ user: data.data })
        }
        this.setState({ loading: false })
      })
      .catch(error => console.log(error))
    }
    else {
      this.setState({ loading: false })
    }
  }

  render() {
    return (
      <div className='app'>
        <UserContext.Provider value={{
          user: this.state.user,
          setUser: this.setUser,
          logoutUser: this.logoutUser
        }}>
            {this.state.loading
            ?
            <h1>Loading...</h1>
            : 
            <Switch>
              {this.state.user.id ? <Redirect exact from="/auth" to="/" /> : null}
              <Route path="/auth" component={Auth} />

              {this.state.user.id ? null : <Redirect from="/" to="/auth" />}
              <Route exact path="/" component={Home} />
            </Switch>}
        </UserContext.Provider>
      </div>
    );
  }
}
