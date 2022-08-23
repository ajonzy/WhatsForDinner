import React, { useContext } from 'react'

import MealForm from '../forms/mealForm'

import { UserContext } from '../app'

export default function AddMeal(props) {
    const { user, setUser } = useContext(UserContext)

    const handleSuccessfulSubmit = data => {
        const newUser = {...user}
        newUser.meals.push(data)
        setUser(newUser)
        props.history.push("/meals")
    }

    return (
        <div className='page-wrapper add-meal-page-wrapper'>
            <MealForm handleSuccessfulSubmit={handleSuccessfulSubmit} />
        </div>
    )
}