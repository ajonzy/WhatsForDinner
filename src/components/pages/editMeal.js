import React, { useContext, useState } from 'react'

import MealForm from '../forms/mealForm'

import { UserContext } from '../app'

export default function EditMeal(props) {
    const { user, setUser } = useContext(UserContext)
    const [meal] = useState(user.meals.filter(meal => meal.id === parseInt(props.match.params.id))[0])

    const handleSuccessfulSubmit = data => {
        user.meals.splice(user.meals.findIndex(meal => meal.id === data.id), 1, data)
        setUser({...user})
        props.history.push(`/meals/view/${data.id}`)
    }

    return (
        (meal 
            ? (
                <div className='page-wrapper edit-meal-page-wrapper'>
                    <MealForm meal={meal} edit handleSuccessfulSubmit={handleSuccessfulSubmit} />
                    <div className="spacer-40" />
                    <button onClick={() => props.history.push(`/meals/view/${meal.id}`)}>Cancel</button>
                </div>
            )
            : (
                <div className='page-wrapper edit-meal-page-wrapper'>
                    <p className="not-found">Sorry, this meal does not exist...</p>
                    <div className="spacer-30" />
                    <div className="options-wrapper">
                        <button onClick={() => props.history.push("/meals")}>Back to Meals</button>
                    </div>
                </div>
            )
        )
    )
}