import React, { useContext, useState } from 'react'

import MealplanForm from '../forms/mealplanForm'

import { UserContext } from '../app'

export default function AddMealplan(props) {
    const { user } = useContext(UserContext)
    const [section, setSection] = useState("mealplan-form")
    const [generatedMeals, setGeneratedMeals] = useState([])
    const [generatedProblem, setGeneratedProblem] = useState(false)

    const handleSuccessfulBuild = (meals, problem) => {
        setGeneratedMeals(meals)
        setGeneratedProblem(problem)
        setSection("mealplan-view")
    }

    const renderSection = () => {
        switch(section) {
            case "mealplan-form": return <MealplanForm handleSuccessfulBuild={handleSuccessfulBuild} />
            case "mealplan-view": return (
                <div className="mealplan-view-wrapper">
                    {generatedProblem ? <p>Unfortunately, not all rules were able to be fulfilled.</p> : null}
                    {generatedMeals.map(meal => (
                        <div className="generated-meal-wrapper" key={`generated-meal-${meal.id}`}>
                            <p>{meal.name}</p>
                            {meal.difficulty > 0 ? <p>{meal.difficulty}</p> : null}
                            {meal.categories.length > 0 
                                ? (
                                    <div className="meal-categories-wrapper">
                                        {"Category: "}
                                        {meal.categories.map((category, index) => (
                                            <p key={`category-${meal.name}-${category}-${index}`}>{category.name}{index === meal.categories.length - 1 ? null : ", "}</p>
                                        ))}
                                    </div>
                                )
                                : null
                            }
                        </div>
                    ))}
                </div>
            )
        }
    }

    return (
        (user.meals.length === 0
            ? (
                <div className='page-wrapper add-mealplan-page-wrapper'>
                    <div className="no-content">
                        You don't have any meals yet!
                        <div className="spacer-20" />
                        <button className='fancy-button' onClick={() => props.history.push("/meals/add")}>Create Meal</button>
                    </div>
                </div>
            )
            : (
                <div className='page-wrapper add-mealplan-page-wrapper'>
                    {renderSection()}
                </div>
            )
        )
    )
}