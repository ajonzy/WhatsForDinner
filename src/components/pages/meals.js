import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'

import { UserContext } from '../app'

export default function Meals(props) {
    const { user } = useContext(UserContext)
    const [mealsList, setMealsList] = useState(user.meals)
    const [sharedMealsList, setSharedMealsList] = useState(user.shared_meals)

    const handleFilter = event => {
        setMealsList(user.meals.filter(meal => (
            meal.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
            (meal.description ? meal.description.toLowerCase().includes(event.target.value.toLowerCase()) : false) ||
            meal.categories.map(category => category.name.toLowerCase()).filter(category => category.includes(event.target.value.toLowerCase())).length > 0 ||
            (meal.difficulty > 0 ? meal.difficulty === parseInt(event.target.value) : false)
        )))

        setSharedMealsList(user.shared_meals.filter(meal => (
            meal.user_username.toLowerCase().includes(event.target.value.toLowerCase()) ||
            meal.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
            (meal.description ? meal.description.toLowerCase().includes(event.target.value.toLowerCase()) : false) ||
            meal.categories.map(category => category.name.toLowerCase()).filter(category => category.includes(event.target.value.toLowerCase())).length > 0 ||
            (meal.difficulty > 0 ? meal.difficulty === parseInt(event.target.value) : false)
        )))
    }

    const renderMeals = () => {
        if (user.meals.length === 0 && user.shared_meals.length === 0) {
            return (
                <div className='no-content'>No meals here yet... Get adding!</div>
            )
        }

        const sharedMeals = sharedMealsList.map(meal => (
            <div key={`meal-${meal.id}`} className="meal-wrapper-shared" onClick={() => props.history.push(`/meals/view/${meal.id}`)}>
                <p className='shared-by'>Shared by: {meal.user_username}</p>
                <p className='name'>{meal.name}</p>
                {meal.difficulty > 0 ? <p className='difficulty'>Difficulty: <span>{"★".repeat(meal.difficulty)}</span></p> : null}
                {meal.image_url ? <img src={meal.image_url} alt="" /> : null}
                {meal.description ? <p className='description'>{meal.description}</p> : null}
            </div>
        ))

        const meals = mealsList.map(meal => (
            <div key={`meal-${meal.id}`} className="meal-wrapper" onClick={() => props.history.push(`/meals/view/${meal.id}`)}>
                <p className='name'>{meal.name}</p>
                {meal.difficulty > 0 ? <p className='difficulty'>Difficulty: <span>{"★".repeat(meal.difficulty)}</span></p> : null}
                {meal.image_url ? <img src={meal.image_url} alt="" /> : null}
                {meal.description ? <p className='description'>{meal.description}</p> : null}
                {meal.categories.length > 0 
                    ? (
                        <div className="meal-categories-wrapper">
                            {"Category: " +
                            meal.categories.map((category, index) => (
                                `${category.name}${index === meal.categories.length - 1 ? "" : ", "}`
                            )).join("")}
                        </div>
                    )
                    : null
                }
            </div>
        ))

        sharedMeals.sort((mealA, mealB) => parseInt(mealA.key.split("-")[1]) > parseInt(mealB.key.split("-")[1]) ? -1 : 1)
        meals.sort((mealA, mealB) => parseInt(mealA.key.split("-")[1]) > parseInt(mealB.key.split("-")[1]) ? -1 : 1)

        return sharedMeals.concat(meals)
    }

    return (
        <div className='page-wrapper meals-page-wrapper'>
            <div className="options-wrapper">
                <Link to="/meals/add"><button>Add Meal</button></Link>
                <input type="text"
                    placeholder='Search: meal names, difficulty, etc.'
                    onChange={handleFilter}
                />
            </div>
            <div className={`meals-wrapper ${sharedMealsList.length > 0 ? "shared-active" : "shared-inactive"}`}>
                {renderMeals()}
            </div>
        </div>
    )
}