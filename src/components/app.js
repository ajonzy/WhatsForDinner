import React, { Component, createContext } from 'react';
import { Route, Redirect } from 'react-router';
import { AnimatedSwitch } from 'react-router-transition'
import Cookies from "js-cookie"

import Navbar from './utils/navbar';
import Auth from './pages/auth';
import Home from './pages/home';
import Meals from './pages/meals';
import AddMeal from './pages/addMeal';
import Meal from './pages/meal';
import EditMeal from './pages/editMeal';
import EditRecipe from './pages/editRecipe';
import Mealplans from './pages/mealplans';
import AddMealplan from './pages/addMealplan';
import Mealplan from './pages/mealplan';
import EditMealplan from './pages/editMealplan';
import EditMeals from './pages/editMeals';
import Shoppinglists from './pages/shoppinglists';
import AddShoppinglist from './pages/addShoppinglist';
import Shoppinglist from './pages/shoppinglist';
import Friends from './pages/friends';
import AddFriend from './pages/addFriend';
import FriendRequests from './pages/friendRequests';
import Friend from './pages/friend';
import ShareItem from './pages/shareItem';

import Loader from "../../static/assets/images/BeaneaterLoader.gif"

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
    fetch(`https://whatsforsupperapi.herokuapp.com/user/logout/single/${token}`, { method: "DELETE" })
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
      fetch(`https://whatsforsupperapi.herokuapp.com//user/get/token/${token}`)
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
      <UserContext.Provider value={{
        user: this.state.user,
        setUser: this.setUser,
        logoutUser: this.logoutUser
      }}>
        <div className='app'>
          <Navbar />
          {this.state.loading
            ? <img src={Loader} alt="Loading" />
            : (
              <div className="content-wrapper">
                <div className="content-wrapper-bg">
                </div>
                  <AnimatedSwitch
                    atEnter={{ opacity: 0 }}
                    atLeave={{ opacity: 0 }}
                    atActive={{ opacity: 1 }}
                  >
                    {this.state.user.id ? <Redirect exact from="/auth" to="/" /> : null}
                    <Route path="/auth" component={Auth} />

                    {this.state.user.id ? null : <Redirect from="/" to="/auth" />}
                    <Route exact path="/" component={Home} />
                    <Route exact path="/meals" component={Meals} />
                    <Route path="/meals/add" component={AddMeal} />
                    <Route path="/meals/view/:id" component={Meal} />
                    <Route path="/meals/edit/:id" component={EditMeal} />
                    <Route path="/meals/recipe/add/:id" component={AddMeal} />
                    <Route path="/meals/recipe/edit/:id" component={EditRecipe} />
                    <Route exact path="/mealplans" component={Mealplans} />
                    <Route path="/mealplans/add" component={AddMealplan} />
                    <Route path="/mealplans/view/:id" component={Mealplan} />
                    <Route path="/mealplans/edit/:id" component={EditMealplan} />
                    <Route path="/mealplans/meals/edit/:id" component={EditMeals} />
                    <Route exact path="/shoppinglists" component={Shoppinglists} />
                    <Route path="/shoppinglists/add" component={AddShoppinglist} />
                    <Route path="/shoppinglists/view/:id" component={Shoppinglist} />
                    <Route exact path="/friends" component={Friends} />
                    <Route path="/friends/add" component={AddFriend} />
                    <Route path="/friends/requests" component={FriendRequests} />
                    <Route path="/friends/view/:username" component={Friend} />
                    <Route path="/share/:type/:id" component={ShareItem} />
                  </AnimatedSwitch>
              </div>
            )
          }
        </div>
      </UserContext.Provider>
    );
  }
}
