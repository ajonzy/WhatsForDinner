import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'

import { UserContext } from '../app'

export default function Mealplans(props) {
    const { user } = useContext(UserContext)
    const [mealplansList, setMealplansList] = useState(user.mealplans)
    const [sharedMealplansList, setSharedMealplansList] = useState(user.shared_mealplans)

    const handleFilter = event => {
        setMealplansList(user.mealplans.filter(mealplan => (
            mealplan.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
            mealplan.created_on.toLowerCase().includes(event.target.value.toLowerCase()) ||
            mealplan.meals.map(meal => meal.name.toLowerCase()).filter(meal => meal.includes(event.target.value.toLowerCase())).length > 0
        )))

        setSharedMealplansList(user.shared_mealplans.filter(mealplan => (
            mealplan.user_username.toLowerCase().includes(event.target.value.toLowerCase()) ||
            mealplan.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
            mealplan.created_on.toLowerCase().includes(event.target.value.toLowerCase()) ||
            mealplan.meals.map(meal => meal.name.toLowerCase()).filter(meal => meal.includes(event.target.value.toLowerCase())).length > 0
        )))
    }

    const renderMealplans = () => {
        if (user.mealplans.length === 0) {
            return (
                <div className='no-content'>No mealplans here yet... Get adding!</div>
            )
        }

        const sharedMealplans = sharedMealplansList.map(mealplan => (
            <div key={`mealplan-${mealplan.id}`} className="mealplan-wrapper-shared" onClick={() => props.history.push(`/mealplans/view/${mealplan.id}`)}>
                <p className='shared-by'>Shared by: {mealplan.user_username}</p>
                <p className='name'>{mealplan.name}</p>
                <p className='created-on'>{mealplan.created_on}</p>
                <div className="mealplan-meals-wrapper">
                    {mealplan.meals.map(meal => (
                        <div className="meal-wrapper" key={`meal-${meal.id}`}>
                            <p className='meal-name'>{meal.name}</p>
                            {meal.difficulty > 0 ? <p className='meal-difficulty'><span>{"★".repeat(meal.difficulty)}</span></p> : null}
                        </div>
                    ))}
                </div>
            </div>
        ))

        const mealplans = mealplansList.map(mealplan => (
            <div key={`mealplan-${mealplan.id}`} className="mealplan-wrapper" onClick={() => props.history.push(`/mealplans/view/${mealplan.id}`)}>
                <p className='name'>{mealplan.name}</p>
                <p className='created-on'>{mealplan.created_on}</p>
                <div className="mealplan-meals-wrapper">
                    {mealplan.meals.map(meal => (
                        <div className="meal-wrapper" key={`meal-${meal.id}`}>
                            <p className='meal-name'>{meal.name}</p>
                            {meal.difficulty > 0 ? <p className='meal-difficulty'><span>{"★".repeat(meal.difficulty)}</span></p> : null}
                        </div>
                    ))}
                </div>
            </div>
        ))

        sharedMealplans.sort((mealplanA, mealplanB) => parseInt(mealplanA.key.split("-")[1]) > parseInt(mealplanB.key.split("-")[1]) ? -1 : 1)
        mealplans.sort((mealplanA, mealplanB) => parseInt(mealplanA.key.split("-")[1]) > parseInt(mealplanB.key.split("-")[1]) ? -1 : 1)

        return sharedMealplans.concat(mealplans)
    }

    return (
        <div className='page-wrapper mealplans-page-wrapper'>
            <div className="options-wrapper">
                <Link to="/mealplans/add"><button>Add Mealplan</button></Link>
                <input type="text"
                    placeholder='Search: mealplan names, mealplans, etc.'
                    onChange={handleFilter}
                />
            </div>
            <div className={`mealplans-wrapper ${sharedMealplansList.length > 0 ? "shared-active" : "shared-inactive"}`}>
                {renderMealplans()}
            </div>
        </div>
    )
}