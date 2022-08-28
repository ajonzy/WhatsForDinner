import React, { useContext, useState } from 'react'

import { UserContext } from '../app'

export default function MealplanForm(props) {
    const { user } = useContext(UserContext)
    const [name, setName] = useState("")
    const [number, setNumber] = useState(7)
    const [rules, setRules] = useState([])

    const handleBuildMealplan = event => {
        event.preventDefault()

        let problem = false

        let meals = [...user.meals]
        const requiredMeals = []
        const numberedMeals = []
        const numberedRequiredMeals = []
        const selectedMeals = []

        rules.forEach(rule => {
            switch(rule.rule) {
                case "None": {
                    if (rule.type === "Category") {
                        meals = meals.filter(meal => !meal.categories.map(category => category.name).includes(rule.value))
                    }
                    else {
                        meals = meals.filter(meal => meal[rule.type.toLowerCase()] != rule.value)
                    }
                    break
                }
                case "Exactly": {
                    for (let i=0; i<rule.amount; i++) {
                        requiredMeals.push({
                            type: rule.type,
                            value: rule.value
                        })
                    }
                    break
                }
                case "No more than": {
                    numberedMeals.push({
                        type: rule.type,
                        value: rule.value,
                        amount: rule.amount
                    })
                    break
                }
                case "At least": {
                    for (let i=0; i<rule.amount; i++) {
                        numberedRequiredMeals.push({
                            type: rule.type,
                            value: rule.value
                        })
                    }
                    break
                }
            }
        })

        const selectMeal = mealChoices => {
            if (mealChoices.length > 0) {
                const selectedMeal = mealChoices[Math.floor(Math.random() * mealChoices.length)]

                numberedMeals.forEach(numberedMeal => {
                    if (numberedMeal.type === "Category") {
                        if (selectedMeal.categories.map(category => category.name).includes(numberedMeal.value)) {
                            numberedMeal.amount -= 1
                        }
    
                        if (numberedMeal.amount === 0) {
                            meals = meals.filter(meal => !meal.categories.map(category => category.name).includes(numberedMeal.value))
                        }
                    }
                    else {
                        if (selectedMeal[numberedMeal.type.toLowerCase()] == numberedMeal.value) {
                            numberedMeal.amount -= 1
                        }
    
                        if (numberedMeal.amount === 0) {
                            meals = meals.filter(meal => meal[numberedMeal.type.toLowerCase()] != numberedMeal.value)
                        }
                    }
                })
    
                meals = meals.filter(meal => meal.id !== selectedMeal.id)
                selectedMeals.push(selectedMeal)
            }
            else {
                problem = true
                selectedMeals.push(user.meals[Math.floor(Math.random() * user.meals.length)])
            }
        }

        while (selectedMeals.length < number) {
            if (requiredMeals.length > 0) {
                let mealChoices = []
                const requiredMeal = requiredMeals.pop()

                if (requiredMeal.type === "Category") {
                    mealChoices = meals.filter(meal => meal.categories.map(category => category.name).includes(requiredMeal.value))
                }
                else {
                    mealChoices = meals.filter(meal => meal[requiredMeal.type.toLowerCase()] == requiredMeal.value)
                }
                selectMeal(mealChoices)

                if (requiredMeals.filter(meal => meal.value === requiredMeal.value).length === 0) {
                    if (requiredMeal.type === "Category") {
                        meals = meals.filter(meal => !meal.categories.map(category => category.name).includes(requiredMeal.value))
                    }
                    else {
                        meals = meals.filter(meal => meal[requiredMeal.type.toLowerCase()] != requiredMeal.value)
                    }
                }
            }
            else if (numberedRequiredMeals.length > 0 && numberedRequiredMeals.length >= (number - selectedMeals.length)) {
                let mealChoices = []
                const requiredMeal = numberedRequiredMeals.pop()

                if (requiredMeal.type === "Category") {
                    if (selectedMeals.filter(meal => meal.categories.map(category => category.name).includes(requiredMeal.value)).length > 0) {
                        mealChoices = meals
                    }
                    else {
                        mealChoices = meals.filter(meal => meal.categories.map(category => category.name).includes(requiredMeal.value))
                    }
                }
                else {
                    if (selectedMeals.filter(meal => meal[requiredMeal.type.toLowerCase()] == requiredMeal.value).length > 0) {
                        mealChoices = meals
                    }
                    else {
                        mealChoices = meals.filter(meal => meal[requiredMeal.type.toLowerCase()] == requiredMeal.value)
                    }
                }
                selectMeal(mealChoices)
            }
            else {
                selectMeal(meals)
            }
        }

        props.handleSuccessfulBuild(selectedMeals, problem)
    }

    return (
        <form className='form-wrapper mealplan-form-wrapper'
            onSubmit={handleBuildMealplan}
        >
            <h3>Create a Mealplan</h3>
            <input type="text"
                value = {name}
                placeholder = "Mealplan Name"
                onChange={event => setName(event.target.value)}
            />
            <label>Number of Meals</label>
            <input type="number" 
                value={number}
                onChange={event => setNumber(event.target.valueAsNumber)}
                min="1"
            />
            <label>Rules</label>
            <div className="rules-wrapper">
                {rules.map((rule, index) => (
                    <div className="rule-wrapper" key={`rule-${index}`}>
                        <select 
                            value={rule.type}
                            onChange={event => {
                                rule.type = event.target.value
                                setRules([...rules])
                            }}
                        >
                            <option value="Category">Category</option>
                            <option value="Name">Name</option>
                            <option value="Difficulty">Difficulty</option>
                        </select>
                        <select 
                            value={rule.rule}
                            onChange={event => {
                                rule.rule = event.target.value
                                setRules([...rules])
                            }}
                        >
                            <option value="At least">At least</option>
                            <option value="No more than">No more than</option>
                            <option value="Exactly">Exactly</option>
                            <option value="None">None</option>
                        </select>
                        {rule.rule === "None"
                            ? null
                            : (
                                <input type="number" 
                                    value={rule.amount}
                                    placeholder="Amount"
                                    onChange={event => {
                                        rule.amount = event.target.value
                                        setRules([...rules])
                                    }}
                                    min="1"
                                />
                            )
                        }
                        <input type="text" 
                            value={rule.value}
                            placeholder="Value"
                            onChange={event => {
                                rule.value = event.target.value
                                setRules([...rules])
                            }}
                        />
                        <button type='button' onClick={() => {
                            rules.splice(index, 1)
                            setRules([...rules])
                        }}>Delete Rule</button>
                    </div>
                ))}
                <button type='button' onClick={() => {
                    rules.push({
                        type: "Category",
                        rule: "At least",
                        amount: 1,
                        value: ""
                    })
                    setRules([...rules])
                }}>Add Rule</button>
            </div>
            <button type='submit'>Generate Mealplan</button>
        </form>
    )
}