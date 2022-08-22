import React, { useContext, useState } from 'react'

import { UserContext } from '../app'

export default function Meals(props) {
    const { user } = useContext(UserContext)
    const [mealsList, setMealsList] = useState(user.meals)
    const [sharedMealsList, setSharedMealsList] = useState(user.shared_meals)

    const handleFilter = event => {
        setMealsList(user.meals.filter(meal => (
            meal.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
            (meal.description ? meal.description.toLowerCase().includes(event.target.value.toLowerCase()) : false) ||
            meal.categories.map(category => category.name.toLowerCase()).includes(event.target.value.toLowerCase()) ||
            (meal.difficulty > 0 ? meal.difficulty === parseInt(event.target.value) : false)
        )))

        setSharedMealsList(user.shared_meals.filter(meal => (
            meal.user_username.toLowerCase().includes(event.target.value.toLowerCase()) ||
            meal.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
            (meal.description ? meal.description.toLowerCase().includes(event.target.value.toLowerCase()) : false) ||
            meal.categories.map(category => category.name.toLowerCase()).includes(event.target.value.toLowerCase()) ||
            (meal.difficulty > 0 ? meal.difficulty === parseInt(event.target.value) : false)
        )))
    }

    const renderMeals = () => {
        if (user.meals.length === 0) {
            return (
                <div>No meals here yet... Get adding!</div>
            )
        }

        const sharedMeals = sharedMealsList.map(meal => (
            <div key={`meal-${meal.id}`} className="meal-wrapper-shared">
                <p className='shared-by'>Shared by: {meal.user_username}</p>
                <p className='name'>{meal.name}</p>
                {meal.difficulty > 0 ? <p className='difficulty'>Difficulty: <span>{"★".repeat(meal.difficulty)}</span></p> : null}
                {meal.image_url ? <img src={meal.image_url} alt="" /> : null}
                {meal.description ? <p className='description'>{meal.description}</p> : null}
            </div>
        ))

        const meals = mealsList.map(meal => (
            <div key={`meal-${meal.id}`} className="meal-wrapper">
                <p className='name'>{meal.name}</p>
                {meal.difficulty > 0 ? <p className='difficulty'>Difficulty: <span>{"★".repeat(meal.difficulty)}</span></p> : null}
                {meal.image_url ? <img src={meal.image_url} alt="" /> : null}
                {meal.description ? <p className='description'>{meal.description}</p> : null}
                {meal.categories.length > 0 
                    ? <div className="meal-categories-wrapper">
                        {"Category: "}
                        {meal.categories.map((category, index) => (
                            <p key={`category-${meal.name}-${category}-${index}`}>{category.name}{index === meal.categories.length - 1 ? null : ", "}</p>
                        ))}
                       </div>
                    : null}
            </div>
        ))

        sharedMeals.sort((mealA, mealB) => mealA.key > mealB.key ? -1 : 1)
        meals.sort((mealA, mealB) => mealA.key > mealB.key ? -1 : 1)

        return sharedMeals.concat(meals)
    }

    return (
        <div className='page-wrapper meals-page-wrapper'>
            <div className="options-wrapper">
                <button>Add Meal</button>
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