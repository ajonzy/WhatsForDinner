import React, { useContext, useState } from 'react'

import GenerateMealplanForm from '../forms/generateMealplanForm'
import MealplanForm from '../forms/mealplanForm'

import { UserContext } from '../app'

import titleize from '../../functions/titleize'

export default function AddMealplan(props) {
    const { user, setUser } = useContext(UserContext)
    const [section, setSection] = useState("mealplan-form")
    const [generatedData, setGeneratedData] = useState({})
    const [generatedMeals, setGeneratedMeals] = useState([])
    const [generatedProblem, setGeneratedProblem] = useState(false)

    const handleBuildMealplan = (name, number, rules) => {
        setGeneratedData({
            name,
            number,
            rules
        })

        let meals = [...user.meals]
        const requiredMeals = []
        const numberedMeals = []
        const numberedRequiredMeals = []
        const selectedMeals = []

        rules.forEach(rule => {
            switch(rule.rule) {
                case "None": {
                    if (rule.type === "Category") {
                        meals = meals.filter(meal => !meal.categories.map(category => category.name).includes(titleize(rule.value)))
                    }
                    else {
                        meals = meals.filter(meal => meal[rule.type.toLowerCase()] != titleize(rule.value))
                    }
                    break
                }
                case "Exactly": {
                    for (let i=0; i<rule.amount; i++) {
                        requiredMeals.push({
                            type: rule.type,
                            value: titleize(rule.value)
                        })
                    }
                    break
                }
                case "No more than": {
                    numberedMeals.push({
                        type: rule.type,
                        value: titleize(rule.value),
                        amount: rule.amount
                    })
                    break
                }
                case "At least": {
                    for (let i=0; i<rule.amount; i++) {
                        numberedRequiredMeals.push({
                            type: rule.type,
                            value: titleize(rule.value)
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
                setGeneratedProblem(true)
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

        setGeneratedMeals(selectedMeals)
        setSection("mealplan-view")
    }

    const handleSuccessfulCreateMealplan = data => {
        const newUser = {...user}
        newUser.mealplans.push(data)
        newUser.shoppinglists.push(data.shoppinglist)
        setUser(newUser)
        props.history.push("/mealplans")

    }

    const renderSection = () => {
        switch(section) {
            case "mealplan-form": return <GenerateMealplanForm handleBuildMealplan={handleBuildMealplan} />
            case "mealplan-view": return <MealplanForm meals={generatedMeals} problem={generatedProblem} data={generatedData} handleSuccessfulCreateMealplan={handleSuccessfulCreateMealplan} />
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