import React, { useContext, useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

import { UserContext } from '../app'

function Navbar(props) {
    const { user, logoutUser } = useContext(UserContext)
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <div className='navbar-wrapper'>
            {!props.loading && props.location.pathname === "/welcome" && !user.id ? null : <Link to="/"><h1 id='app-header' onClick={() => setMenuOpen(false)}>What's&nbsp;For&nbsp;Supper?</h1></Link>}
            {!props.loading && props.location.pathname === "/welcome" && !user.id ? <div className='initial-auth'><Link to="/auth">Login/Register</Link></div> : null}
            {user.id 
                ? (
                    <div className="user-menu-wrapper">
                        <div className="username">{user.username}</div>
                        <div className={`menu ${menuOpen ? 'active' : 'inactive'}`} onClick={() => setMenuOpen(!menuOpen)}><FontAwesomeIcon icon={faBars} /></div>
                        <div className={`menu-wrapper ${menuOpen ? 'active' : 'inactive'}`} onClick={() => setMenuOpen(false)}>
                            <Link to="/">Home</Link>
                            <Link to="/meals">Meals</Link>
                            <Link to="/mealcategories">Meal Categories</Link>
                            <Link to="/mealplans">Mealplans</Link>
                            <Link to="/mealplanoutlines">Mealplan Outlines</Link>
                            <Link to="/shoppinglists">Shopping Lists</Link>
                            <Link to="/friends">Friends</Link>
                            <Link to="/settings">Settings</Link>
                            <div onClick={logoutUser}>Logout</div>
                        </div>
                    </div>
                )
                : null
            }
        </div>
    )
}

export default withRouter(Navbar)