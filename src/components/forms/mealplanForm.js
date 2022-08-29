import React, { useContext, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark, faHandPointer, faLock, faRotate, faUnlock } from '@fortawesome/free-solid-svg-icons'

import LoadingError from '../utils/loadingError'

import { UserContext } from '../app'

export default function MealplanForm(props) {
    const { user } = useContext(UserContext)
    const [meals, setMeals] = useState(props.meals.map(meal => ({...meal, locked: false})))
    const [problem, setProblem] = useState(props.problem)
    const [data] = useState(props.data)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLock = lockedMeal => {
        const meal = meals.filter(meal => meal.id === lockedMeal.id)[0]
        meal.locked = !meal.locked
        setMeals([...meals])
    }

    const handleRefresh = refreshedMeal => {
        const newMeal = user.meals.filter(meal => meals.every(generatedMeal => generatedMeal.id !== meal.id))[Math.floor(Math.random() * (user.meals.length - meals.length))]
        meals.splice(meals.findIndex(meal => meal.id === refreshedMeal.id), 1, newMeal)
        setMeals([...meals])
    }

    const handleSubmit = event => {
        event.preventDefault()

        setError("")

        if (true) {
            setLoading(true)

            fetch("https://whatsforsupperapi.herokuapp.com/mealplan/add", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    name: data.name,
                    created_on: new Date().toLocaleDateString(),
                    user_username: user.username,
                    user_id: user.id,
                    meals: meals.map(meal => meal.id)
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    props.handleSuccessfulCreateMealplan(data.data)
                }
                else {
                    setError("An error occured... Please try again later.")
                    console.log(data)
                    setLoading(false)
                }
            })
            .catch(error => {
                setError("An error occured... Please try again later.")
                setLoading(false)
                console.log("Error adding mealplan: ", error)
            })
        }
    }

    return (
        <form className='form-wrapper mealplan-form-wrapper'
            onSubmit={handleSubmit}
        >
            <h2 className='name'>{data.name}</h2>
            {problem ? <p>Unfortunately, not all rules were able to be fulfilled.</p> : null}
            {meals.map(meal => (
                <div className="generated-meal-wrapper" key={`generated-meal-${meal.id}`}>
                    <p className='meal-name'>{meal.name}</p>
                    {meal.difficulty > 0 ? <p className='meal-difficulty'>Difficulty: <span>{"★".repeat(meal.difficulty)}</span></p> : null}
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
                    <div className="options-wrapper">
                        {meal.locked ? <button type='button' className='icon-button' onClick={() => handleLock(meal)} disabled={loading}><FontAwesomeIcon icon={faUnlock} /></button> : <button type='button' className='icon-button' onClick={() => handleLock(meal)} disabled={loading}><FontAwesomeIcon icon={faLock} /></button>}
                        <button type='button' className='icon-button' disabled={meal.locked || loading} onClick={() => handleRefresh(meal)}><FontAwesomeIcon icon={faRotate} /></button>
                        <button type='button' className='icon-button' disabled={meal.locked || loading}><FontAwesomeIcon icon={faHandPointer} /></button>
                        <button type='button' className='icon-button' disabled={meal.locked || loading}><FontAwesomeIcon icon={faCircleXmark} /></button>
                    </div>
                </div>
            ))}
            <div className="spacer-40" />
            <button type="submit" disabled={loading}>Create Mealplan</button>
            <LoadingError loading={loading} error={error} />
        </form>
    )
}