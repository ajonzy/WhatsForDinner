import React, { Component, createContext } from 'react';
import { Route, Redirect, Switch, withRouter } from 'react-router';
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import Cookies from "js-cookie"
import io from 'socket.io-client'

import Navbar from './utils/navbar';
import Notifications from './utils/notifications';
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
import EditShoppinglist from './pages/editShoppinglist';
import EditShoppingingredients from './pages/editIngredients';
import Friends from './pages/friends';
import AddFriend from './pages/addFriend';
import FriendRequests from './pages/friendRequests';
import Friend from './pages/friend';
import ShareItem from './pages/shareItem';

import Loader from "../../static/assets/images/BeaneaterLoader.gif"

export const UserContext = createContext({})

class App extends Component {
  constructor() {
    super()

    this.state = {
      user: {},
      socket: {},
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
      loading: true
    })
    fetch(`https://whatsforsupperapi.herokuapp.com/user/logout/single/${token}`, { method: "DELETE" })
    .then(response => response.json())
    .then(data => {
      if (data.status === 200) {
        this.setState({ 
          user: {},
          loading: false 
        })
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
      fetch(`https://whatsforsupperapi.herokuapp.com/user/get/token/${token}`)
      .then(response => response.json())
      .then(data => {
        if (data.status === 403) {
          Cookies.remove("token")
        }
        else if (data.status === 200) {
          const socket = io("https://whatsforsupperapi.herokuapp.com/")

          socket.on("friend-request-update", data => {
            if (this.state.user.id === data.data.friend.id) {
              const friendsList = this.state.user.incoming_friend_requests
              const notifications = this.state.user.notifications
              switch(data.type) {
                case "add": {
                  const friend = { user_id: data.data.user.id, username: data.data.user.username }
                  friendsList.push(friend)
                  notifications.push(data.data.notification)
                  break
                }
                case "delete": {
                  friendsList.splice(friendsList.findIndex(friend => friend.user_id === data.data.user.id), 1)
                  if (data.data.notification) {
                    notifications.splice(notifications.findIndex(notification => notification.id === data.data.notification.id), 1)
                  }
                  break
                }
              }
              this.setUser({...this.state.user})
            }
          })

          socket.on("shared-friend-request-update", data => {
            if (this.state.user.id === data.data.friend.id) {
              const friendsList = this.state.user.outgoing_friend_requests
              friendsList.splice(friendsList.findIndex(friend => friend.user_id === data.data.user.id), 1)
              this.setUser({...this.state.user})
            }
          })

          socket.on("friend-update", data => {
            if (this.state.user.id === data.data.friend.id) {
              const friendsList = this.state.user.friends
              const incomingFriendsList = this.state.user.incoming_friend_requests
              const outgoingFriendsList = this.state.user.outgoing_friend_requests
              const notificationsList = this.state.user.notifications
              switch(data.type) {
                case "add": {
                  const friend = { user_id: data.data.user.id, username: data.data.user.username }
                  friendsList.push(friend)
                  if (incomingFriendsList.filter(friend => friend.user_id === data.data.user.id).length > 0) {
                    incomingFriendsList.splice(incomingFriendsList.findIndex(friend => friend.user_id === data.data.user.id), 1)
                  }
                  if (outgoingFriendsList.filter(friend => friend.user_id === data.data.user.id).length > 0) {
                    outgoingFriendsList.splice(outgoingFriendsList.findIndex(friend => friend.user_id === data.data.user.id), 1)
                  }
                  notificationsList.push(data.data.notification)
                  if (data.data.removed_notification.id) {
                    notificationsList.splice(notificationsList.findIndex(notification => notification.id === data.data.removed_notification.id), 1)
                  }
                  break
                }
                case "delete": {
                  friendsList.splice(friendsList.findIndex(friend => friend.user_id === data.data.user.id), 1)
                  break
                }
              }
              console.log(this.state.user)
              this.setUser({...this.state.user})
            }
          })

          socket.on("meal-share-update", data => {
            if (this.state.user.id === data.data.user.id) {
              const meals = this.state.user.shared_meals
              const notifications = this.state.user.notifications
              switch(data.type) {
                case "add": {
                  meals.push(data.data.meal)
                  notifications.push(data.data.notification)
                  break
                }
                // TODO: Add possible update functionality
              }
              this.setUser({...this.state.user})
            }
          })

          socket.on("mealplan-share-update", data => {
            if (this.state.user.id === data.data.user.id) {
              const mealplans = this.state.user.shared_mealplans
              const shoppinglists = this.state.user.shared_shoppinglists
              const notifications = this.state.user.notifications
              switch(data.type) {
                case "add": {
                  mealplans.push(data.data.mealplan)
                  if (data.data.mealplan.shoppinglist) {
                    shoppinglists.push(data.data.mealplan.shoppinglist)
                  }
                  notifications.push(data.data.notification)
                  break
                }
                // TODO: Add possible update functionality
              }
              this.setUser({...this.state.user})
            }
          })

          socket.on("shoppinglist-share-update", data => {
            if (this.state.user.id === data.data.user.id) {
              const shoppinglists = this.state.user.shared_shoppinglists
              const notifications = this.state.user.notifications
              switch(data.type) {
                case "add": {
                  shoppinglists.push(data.data.shoppinglist)
                  notifications.push(data.data.notification)
                  break
                }
                // TODO: Add possible update functionality
              }
              this.setUser({...this.state.user})
            }
          })

          socket.on("shoppingingredient-update", data => {
            const sharedShoppinglist = this.state.user.shared_shoppinglists.filter(shoppinglist => shoppinglist.id === data.data.shoppinglist_id)[0]
            if (sharedShoppinglist) {
              switch(data.type) {
                case "add": {
                  sharedShoppinglist.shoppingingredients.push(data.data)
                  break
                }
                case "update": {
                  sharedShoppinglist.shoppingingredients.splice(sharedShoppinglist.shoppingingredients.findIndex(ingredient => ingredient.id === data.data.id), 1, data.data)
                  break
                }
                case "delete": {
                  sharedShoppinglist.shoppingingredients.splice(sharedShoppinglist.shoppingingredients.findIndex(ingredient => ingredient.id === data.data.id), 1)
                  break
                }
              }
              this.setUser({...this.state.user})
            }
          })

          socket.on("shoppingingredient-update-multiple", data => {
            data.data.forEach(shoppingingredient => {
              const sharedShoppinglist = this.state.user.shared_shoppinglists.filter(shoppinglist => shoppinglist.id === shoppingingredient.shoppinglist_id)[0]
              if (sharedShoppinglist) {
                sharedShoppinglist.shoppingingredients.push(shoppingingredient)
                this.setUser({...this.state.user})
              }
            })
          })

          socket.on("shared-shoppingingredient-update", data => {
            const shoppinglist = this.state.user.shoppinglists.filter(shoppinglist => shoppinglist.id === data.data.shoppinglist_id)[0]
            const sharedShoppinglist = this.state.user.shared_shoppinglists.filter(shoppinglist => shoppinglist.id === data.data.shoppinglist_id)[0]
            if (shoppinglist) {
              shoppinglist.shoppingingredients.splice(shoppinglist.shoppingingredients.findIndex(ingredient => ingredient.id === data.data.id), 1, data.data)
              this.setUser({...this.state.user})
            }
            if (sharedShoppinglist) {
              sharedShoppinglist.shoppingingredients.splice(sharedShoppinglist.shoppingingredients.findIndex(ingredient => ingredient.id === data.data.id), 1, data.data)
              this.setUser({...this.state.user})
            }
          })

          this.setState({ 
            user: data.data,
            socket
          })
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
        socket: this.state.socket,
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
                <Notifications />
                  <TransitionGroup>
                    <CSSTransition
                      timeout={150}
                      classNames="page-transition"
                      key={this.props.location.key}
                    >
                      <Switch location={this.props.location}>
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
                        <Route path="/shoppinglists/edit/:id" component={EditShoppinglist} />
                        <Route path="/shoppinglists/items/edit/:id" component={EditShoppingingredients} />
                        <Route exact path="/friends" component={Friends} />
                        <Route path="/friends/add" component={AddFriend} />
                        <Route path="/friends/requests" component={FriendRequests} />
                        <Route path="/friends/view/:username" component={Friend} />
                        <Route path="/share/:type/:id" component={ShareItem} />
                      </Switch>
                    </CSSTransition>
                  </TransitionGroup>
              </div>
            )
          }
        </div>
      </UserContext.Provider>
    );
  }
}

export default withRouter(App)