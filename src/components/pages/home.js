import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faBurger, faScroll, faUserGroup } from '@fortawesome/free-solid-svg-icons'

export default function Home(props) {
    return (
        <div className='page-wrapper home-page-wrapper'>
            <div className="links-wrapper">
                <Link to="/mealplans"><div className="link-box">
                    <FontAwesomeIcon icon={faCalendarDays} />
                    Mealplans
                </div></Link>
                <Link to="/meals"><div className="link-box">
                    <FontAwesomeIcon icon={faBurger} />
                    Meals
                </div></Link>
                <Link to="/shoppinglists"><div className="link-box">
                    <FontAwesomeIcon icon={faScroll} />
                    Shopping Lists
                </div></Link>
                <Link to="/friends"><div className="link-box">
                    <FontAwesomeIcon icon={faUserGroup} />
                    Friends
                </div></Link>
            </div>

            <button>Create Mealplan</button>
        </div>
    )
}