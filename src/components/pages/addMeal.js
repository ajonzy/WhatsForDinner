import React, { useContext, useState } from 'react'

import MealForm from '../forms/mealForm'
import RecipeForm from '../forms/recipeForm'

import { UserContext } from '../app'

export default function AddMeal(props) {
    const { user, setUser } = useContext(UserContext)
    const [section, setSection] = useState(props.match.params.id ? "recipe-form" : "meal-form")
    const [meal, setMeal] = useState(props.match.params.id ? user.meals.filter(meal => meal.id === parseInt(props.match.params.id))[0] : {})

    const finish = () => {
        const newUser = {...user}
        if (props.match.params.id) {
            newUser.meals.splice(newUser.meals.findIndex(userMeal => userMeal.id === meal.id), 1, meal)
        }
        else {
            newUser.meals.push(meal)
        }
        newUser.categories.push(...meal.categories.filter(mealCategory => user.categories.every(userCategory => userCategory.id !== mealCategory.id)))
        setUser(newUser)
        if (props.match.params.id) {
            props.history.push(`/meals/view/${meal.id}`)
        }
        else {
            props.history.push("/meals")
        }
    }

    const handleSuccessfulAddMeal = data => {
        setMeal(data)
        setSection("recipe-check")
    }

    const handleSuccessfulAddRecipe = data => {
        setMeal(data)
        finish()
    }

    const renderRecipeCheck = () => {
        const handleAddRecipe = () => setSection("recipe-form")
        const handleSkip = () => finish()

        return (
            <div className="recipe-check-wrapper">
                <p>Would you like to add a recipe for {meal.name}? You can always do so later as well.</p>
                <button onClick={handleAddRecipe}>Add Recipe</button>
                <button onClick={handleSkip}>Skip</button>
            </div>
        )
    }

    const renderSection = () => {
        switch (section) {
            case "meal-form": return <MealForm handleSuccessfulSubmit={handleSuccessfulAddMeal} />
            case "recipe-check": return renderRecipeCheck()
            case "recipe-form": return (
                (meal
                    ? <RecipeForm meal={meal} handleSuccessfulSubmit={handleSuccessfulAddRecipe} />
                    : (
                        <div className='add-recipe-wrapper'>
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
    }

    return (
        <div className='page-wrapper add-meal-page-wrapper'>
            {renderSection()}
            {section !== "recipe-check" ? <div className="spacer-40" /> : null }
            {section !== "recipe-check" ? <button onClick={() => section === "meal-form" ? props.history.push("/meals") : finish()}>Cancel</button> : null }
        </div>
    )
}