import React, { useContext, useState } from 'react'

import MealForm from '../forms/mealForm'
import RecipeForm from '../forms/recipeForm'

import { UserContext } from '../app'

export default function AddMeal(props) {
    const { user, setUser } = useContext(UserContext)
    const [section, setSection] = useState("meal-form")
    const [meal, setMeal] = useState({})

    const finish = () => {
        const newUser = {...user}
        newUser.meals.push(meal)
        setUser(newUser)
        props.history.push("/meals")
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
            case "recipe-form": return <RecipeForm meal={meal} handleSuccessfulSubmit={handleSuccessfulAddRecipe} />
        }
    }

    return (
        <div className='page-wrapper add-meal-page-wrapper'>
            {renderSection()}
        </div>
    )
}