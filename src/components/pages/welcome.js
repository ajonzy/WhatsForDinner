import React, { useEffect } from 'react'
import Cookies from 'js-cookie'
import { Link } from 'react-router-dom'

export default function Welcome(props) {
    useEffect(() => Cookies.set("visited", "true", { expires: 1825 }), [])

    return (
        <div className='page-wrapper welcome-page-wrapper'>
            <h3>Welcome to<br/><span>What's For Supper?</span></h3>
            <p>Let us ease your burden of having to figure out what your family (or just yourself!) should eat night after night, week after week.</p>
            <p>Start by entering in all of the meals that you enjoy, and add recipes if desired.</p>
            <p>Then sit back and watch as we pick from your meals to create a unique mealplan for you based off of your specifications!</p>
            <p>Not 100% happy with it? No problem! Customize the mealplan as much as you see fit.</p>
            <p>Now that you have your mealplan, watch as we generate a custom shopping list based off of any recipes you have added!</p>
            <p>Customize your shopping list with any additional items you may want, and you are ready for the store!</p>
            <p>Finally, invite friends and share your meals, recipes, and mealplans. You can even share your shopping lists to team up and make your shopping trips easier than ever!</p>
            <p>What are you waiting for?</p>
            <div className="options-wrapper">
                <Link to="/auth?register"><button className="fancy-button">Signup Now!</button></Link>
            </div>
        </div>
    )
}