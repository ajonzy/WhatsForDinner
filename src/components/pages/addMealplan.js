import React, { useContext, useState } from 'react'

import GenerateMealplanForm from '../forms/generateMealplanForm'
import MealplanForm from '../forms/mealplanForm'

import { UserContext } from '../app'

import titleize from '../../functions/titleize'
import generateMeals from '../../functions/generateMeals'

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

        // let meals = [...user.meals]
        // const requiredMeals = []
        // const numberedMeals = []
        // const numberedRequiredMeals = []
        // let totalRequiredMeals = 0
        // const selectedMeals = []

        // rules.forEach(rule => {
        //     switch(rule.rule) {
        //         case "None": {
        //             if (rule.type === "Category") {
        //                 meals = meals.filter(meal => !meal.categories.map(category => category.name).includes(titleize(rule.value)))
        //             }
        //             else {
        //                 meals = meals.filter(meal => meal[rule.type.toLowerCase()] != titleize(rule.value))
        //             }
        //             break
        //         }
        //         case "Exactly": {
        //             if (
        //                 (rule.type === "Category" && meals.filter(meal => meal.categories.map(category => category.name).includes(titleize(rule.value))).length < rule.amount) ||
        //                 (rule.type !== "Category" && meals.filter(meal => meal[rule.type.toLowerCase()] == titleize(rule.value)).length < rule.amount) ||
        //                 (rules.filter(rule => rule.rule === "None").filter(noneRule => noneRule.value === rule.value).length > 0)
        //             ) {
        //                 setGeneratedProblem(true)
        //             }
        //             else {
        //                 for (let i=0; i<rule.amount; i++) {
        //                     requiredMeals.push({
        //                         type: rule.type,
        //                         value: titleize(rule.value),
        //                         amount: rule.amount
        //                     })
        //                 }
        //                 numberedMeals.push({
        //                     type: rule.type,
        //                     value: titleize(rule.value),
        //                     amount: rule.amount
        //                 })
        //                 totalRequiredMeals += rule.amount
        //             }
        //             break
        //         }
        //         case "No more than": {
        //             if (
        //                 (rules.filter(rule => rule.rule === "Exactly").filter(exactlyRule => exactlyRule.type === rule.type && exactlyRule.value === rule.value).filter(exactlyRule => exactlyRule.amount > rule.amount).length > 0) ||
        //                 (rules.filter(rule => rule.rule === "At least").filter(atLeastRule => atLeastRule.type === rule.type && atLeastRule.value === rule.value).filter(atLeastRule => atLeastRule.amount > rule.amount).length > 0)
        //             ) {
        //                 setGeneratedProblem(true)
        //             }
        //             else {
        //                 numberedMeals.push({
        //                     type: rule.type,
        //                     value: titleize(rule.value),
        //                     amount: rule.amount
        //                 })
        //             }
        //             break
        //         }
        //         case "At least": {
        //             if (
        //                 (rule.type === "Category" && meals.filter(meal => meal.categories.map(category => category.name).includes(titleize(rule.value))).length < rule.amount) ||
        //                 (rule.type !== "Category" && meals.filter(meal => meal[rule.type.toLowerCase()] == titleize(rule.value)).length < rule.amount) ||
        //                 (rules.filter(rule => rule.rule === "None").filter(noneRule => noneRule.value === rule.value).length > 0) ||
        //                 (rules.filter(rule => rule.rule === "Exactly").filter(exactlyRule => exactlyRule.type === rule.type && exactlyRule.value === rule.value).filter(exactlyRule => exactlyRule.amount < rule.amount).length > 0)
        //             ) {
        //                 setGeneratedProblem(true)
        //             }
        //             else {
        //                 for (let i=0; i<rule.amount; i++) {
        //                     numberedRequiredMeals.push({
        //                         type: rule.type,
        //                         value: titleize(rule.value),
        //                         amount: rule.amount
        //                     })
        //                 }
        //                 totalRequiredMeals += rule.amount
        //             }
        //             break
        //         }
        //     }
        // })
        // if (totalRequiredMeals > number) {
        //     const foundMeals = {}
        //     let foundMealsNumber = 0

        //     const consolidateRequirements = (incomingMeals, foundNumber, consolidationLength) => {
        //         const allRequiredMeals = [...requiredMeals, ...numberedRequiredMeals].sort(function(){return 0.5 - Math.random()})
        //         let availableMeals = [...incomingMeals]

        //         const consolidateMeal = (ruleName, rules, meal, oldRuleName) => {
        //             availableMeals = availableMeals.filter(meal => meal.id !== meal.id)
        //             if (oldRuleName) {
        //                 foundMeals[oldRuleName].splice(foundMeals[oldRuleName].findIndex(foundMeal => foundMeal.id === meal.id), 1)
        //                 if (foundMeals[oldRuleName].length === 0) {
        //                     delete foundMeals[oldRuleName]
        //                 }
        //             }
                
        //             if (foundMeals[ruleName]) {
        //                 foundMeals[ruleName].push({...meal, rules: [...(meal.rules ? meal.rules : []), ...rules], ruleName})
        //             }
        //             else {
        //                 foundMeals[ruleName] = [{...meal, rules: [...(meal.rules ? meal.rules : []), ...rules], ruleName}]
        //             }

        //             foundMealsNumber = Object.values(foundMeals).filter(foundMealName => foundMealName[0].rules.length > consolidationLength).length
        //         }
    
        //         while (allRequiredMeals.length > 0 && totalRequiredMeals - foundMealsNumber > number) {
        //             const checkedMeal = allRequiredMeals.pop()
        //             allRequiredMeals.every(mealToCheck => {
        //                 if (totalRequiredMeals - foundMealsNumber <= number) {
        //                     return false
        //                 }
        //                 availableMeals.every(meal => {
        //                     if (checkedMeal.type === "Category") {
        //                         if (mealToCheck.type === "Category") {
        //                             if (meal.categories.map(category => category.name).includes(checkedMeal.value) && meal.categories.map(category => category.name).includes(mealToCheck.value)) {
        //                                 if (
        //                                     (meal.rules && 
        //                                     (meal.rules.filter(rule => rule.type === checkedMeal.type && rule.value === checkedMeal.value).length === 0) &&
        //                                     (meal.rules.filter(rule => rule.type === mealToCheck.type && rule.value === mealToCheck.value).length === 0)) ||
        //                                     !meal.rules
        //                                 ) {
        //                                     consolidateMeal(meal.ruleName ? `${meal.ruleName}-${checkedMeal.type}-${checkedMeal.value}` : `${checkedMeal.type}-${checkedMeal.value}`, [checkedMeal, mealToCheck], meal, meal.ruleName)
        //                                 }
        //                                 else if (meal.rules.filter(rule => rule.type === checkedMeal.type && rule.value === checkedMeal.value).length === 0) {
        //                                     consolidateMeal(meal.ruleName ? `${meal.ruleName}-${checkedMeal.type}-${checkedMeal.value}` : `${checkedMeal.type}-${checkedMeal.value}`, [checkedMeal], meal, meal.ruleName)
        //                                 }
        //                                 else if (meal.rules.filter(rule => rule.type === mealToCheck.type && rule.value === mealToCheck.value).length === 0) {
        //                                     consolidateMeal(meal.ruleName ? `${meal.ruleName}-${checkedMeal.type}-${checkedMeal.value}` : `${checkedMeal.type}-${checkedMeal.value}`, [mealToCheck], meal, meal.ruleName)
        //                                 }
        //                             }
        //                         }
        //                         else {
        //                             if (meal.categories.map(category => category.name).includes(checkedMeal.value) && meal[mealToCheck.type.toLowerCase()] == mealToCheck.value) {
        //                                 if (
        //                                     (meal.rules && 
        //                                     (meal.rules.filter(rule => rule.type === checkedMeal.type && rule.value === checkedMeal.value).length === 0) &&
        //                                     (meal.rules.filter(rule => rule.type === mealToCheck.type && rule.value === mealToCheck.value).length === 0)) ||
        //                                     !meal.rules
        //                                 ) {
        //                                     consolidateMeal(meal.ruleName ? `${meal.ruleName}-${checkedMeal.type}-${checkedMeal.value}` : `${checkedMeal.type}-${checkedMeal.value}`, [checkedMeal, mealToCheck], meal, meal.ruleName)
        //                                 }
        //                                 else if (meal.rules.filter(rule => rule.type === checkedMeal.type && rule.value === checkedMeal.value).length === 0) {
        //                                     consolidateMeal(meal.ruleName ? `${meal.ruleName}-${checkedMeal.type}-${checkedMeal.value}` : `${checkedMeal.type}-${checkedMeal.value}`, [checkedMeal], meal, meal.ruleName)
        //                                 }
        //                                 else if (meal.rules.filter(rule => rule.type === mealToCheck.type && rule.value === mealToCheck.value).length === 0) {
        //                                     consolidateMeal(meal.ruleName ? `${meal.ruleName}-${checkedMeal.type}-${checkedMeal.value}` : `${checkedMeal.type}-${checkedMeal.value}`, [mealToCheck], meal, meal.ruleName)
        //                                 }
        //                             }
        //                         }
        //                     }
        //                     else {
        //                         if (mealToCheck.type === "Category") {
        //                             if (meal[checkedMeal.type.toLowerCase()] == checkedMeal.value && meal.categories.map(category => category.name).includes(mealToCheck.value)) {
        //                                 if (
        //                                     (meal.rules && 
        //                                     (meal.rules.filter(rule => rule.type === checkedMeal.type && rule.value === checkedMeal.value).length === 0) &&
        //                                     (meal.rules.filter(rule => rule.type === mealToCheck.type && rule.value === mealToCheck.value).length === 0)) ||
        //                                     !meal.rules
        //                                 ) {
        //                                     consolidateMeal(meal.ruleName ? `${meal.ruleName}-${checkedMeal.type}-${checkedMeal.value}` : `${checkedMeal.type}-${checkedMeal.value}`, [checkedMeal, mealToCheck], meal, meal.ruleName)
        //                                 }
        //                                 else if (meal.rules.filter(rule => rule.type === checkedMeal.type && rule.value === checkedMeal.value).length === 0) {
        //                                     consolidateMeal(meal.ruleName ? `${meal.ruleName}-${checkedMeal.type}-${checkedMeal.value}` : `${checkedMeal.type}-${checkedMeal.value}`, [checkedMeal], meal, meal.ruleName)
        //                                 }
        //                                 else if (meal.rules.filter(rule => rule.type === mealToCheck.type && rule.value === mealToCheck.value).length === 0) {
        //                                     consolidateMeal(meal.ruleName ? `${meal.ruleName}-${checkedMeal.type}-${checkedMeal.value}` : `${checkedMeal.type}-${checkedMeal.value}`, [mealToCheck], meal, meal.ruleName)
        //                                 }
        //                             }
        //                         }
        //                         else {
        //                             if (meal[checkedMeal.type.toLowerCase()] == checkedMeal.value && meal[mealToCheck.type.toLowerCase()] == mealToCheck.value) {
        //                                 if (
        //                                     (meal.rules && 
        //                                     (meal.rules.filter(rule => rule.type === checkedMeal.type && rule.value === checkedMeal.value).length === 0) &&
        //                                     (meal.rules.filter(rule => rule.type === mealToCheck.type && rule.value === mealToCheck.value).length === 0)) ||
        //                                     !meal.rules
        //                                 ) {
        //                                     consolidateMeal(meal.ruleName ? `${meal.ruleName}-${checkedMeal.type}-${checkedMeal.value}` : `${checkedMeal.type}-${checkedMeal.value}`, [checkedMeal, mealToCheck], meal, meal.ruleName)
        //                                 }
        //                                 else if (meal.rules.filter(rule => rule.type === checkedMeal.type && rule.value === checkedMeal.value).length === 0) {
        //                                     consolidateMeal(meal.ruleName ? `${meal.ruleName}-${checkedMeal.type}-${checkedMeal.value}` : `${checkedMeal.type}-${checkedMeal.value}`, [checkedMeal], meal, meal.ruleName)
        //                                 }
        //                                 else if (meal.rules.filter(rule => rule.type === mealToCheck.type && rule.value === mealToCheck.value).length === 0) {
        //                                     consolidateMeal(meal.ruleName ? `${meal.ruleName}-${checkedMeal.type}-${checkedMeal.value}` : `${checkedMeal.type}-${checkedMeal.value}`, [mealToCheck], meal, meal.ruleName)
        //                                 }
        //                             }
        //                         }
        //                     }

        //                     if (totalRequiredMeals - foundMealsNumber <= number) {
        //                         return false
        //                     }
        //                     return true
        //                 })
        //                 return true
        //             })
        //         }

        //         Object.values(foundMeals).filter(foundMealName => foundMealName[0].rules.length <= consolidationLength).forEach(foundMeal => delete foundMeals[foundMeal[0].ruleName])
        //         foundMealsNumber = Object.values(foundMeals).length

        //         if (totalRequiredMeals - foundMealsNumber > number && foundNumber < foundMealsNumber) {
        //             consolidateRequirements(Object.values(foundMeals).flat(), foundMealsNumber, ++consolidationLength)
        //         }
        //         else if (totalRequiredMeals - foundMealsNumber <= number) {
        //             totalRequiredMeals = totalRequiredMeals - foundMealsNumber
        //         }
        //     }

        //     consolidateRequirements([...meals], 0, 1)

        //     Object.values(foundMeals).map(foundMeal => foundMeal[0]).forEach(selectedMeal => {
        //         meals = meals.filter(meal => meal.id !== selectedMeal.id)
        //         selectedMeals.push(selectedMeal)

        //         numberedMeals.forEach(numberedMeal => {
        //             if (numberedMeal.type === "Category") {
        //                 if (selectedMeal.categories.map(category => category.name).includes(numberedMeal.value)) {
        //                     numberedMeal.amount -= 1
        //                 }
    
        //                 if (numberedMeal.amount === 0) {
        //                     meals = meals.filter(meal => !meal.categories.map(category => category.name).includes(numberedMeal.value))
        //                 }
        //             }
        //             else {
        //                 if (selectedMeal[numberedMeal.type.toLowerCase()] == numberedMeal.value) {
        //                     numberedMeal.amount -= 1
        //                 }
    
        //                 if (numberedMeal.amount === 0) {
        //                     meals = meals.filter(meal => meal[numberedMeal.type.toLowerCase()] != numberedMeal.value)
        //                 }
        //             }
        //         })
        //     })

        //     if (totalRequiredMeals > number) {
        //         setGeneratedProblem(true)
        //     }
        // }

        // const selectMeal = mealChoices => {
        //     let selectedMeal

        //     if (mealChoices.length > 0) {
        //         selectedMeal = mealChoices[Math.floor(Math.random() * mealChoices.length)]
        //         meals = meals.filter(meal => meal.id !== selectedMeal.id)
        //         selectedMeals.push(selectedMeal)
        //     }
        //     else {
        //         selectedMeal = { categories: [], name: "", difficulty: -1 }
        //     }

        //     return selectedMeal
        // }

        // const requiredMealsLoop = [...requiredMeals]
        // const numberedRequiredMealsLoop = [...numberedRequiredMeals]

        // while (selectedMeals.length < number && meals.length > 0) {
        //     if (requiredMealsLoop.length > 0) {
        //         let mealChoices = []
        //         const requiredMeal = requiredMealsLoop.pop()

        //         if (requiredMeal.type === "Category") {
        //             mealChoices = meals.filter(meal => meal.categories.map(category => category.name).includes(requiredMeal.value))
        //         }
        //         else {
        //             mealChoices = meals.filter(meal => meal[requiredMeal.type.toLowerCase()] == requiredMeal.value)
        //         }

        //         const selectedMeal = selectMeal(mealChoices)

        //         numberedMeals.forEach(numberedMeal => {
        //             if (numberedMeal.type === "Category") {
        //                 if (selectedMeal.categories.map(category => category.name).includes(numberedMeal.value)) {
        //                     numberedMeal.amount -= 1
        //                 }
    
        //                 if (numberedMeal.amount === 0) {
        //                     meals = meals.filter(meal => !meal.categories.map(category => category.name).includes(numberedMeal.value))
        //                 }
        //             }
        //             else {
        //                 if (selectedMeal[numberedMeal.type.toLowerCase()] == numberedMeal.value) {
        //                     numberedMeal.amount -= 1
        //                 }
    
        //                 if (numberedMeal.amount === 0) {
        //                     meals = meals.filter(meal => meal[numberedMeal.type.toLowerCase()] != numberedMeal.value)
        //                 }
        //             }
        //         })
        //     }
        //     else if (numberedRequiredMealsLoop.length > 0) {
        //         let mealChoices = []
        //         const requiredMeal = numberedRequiredMealsLoop.pop()

        //         if (
        //             (requiredMeal.type === "Category" && selectedMeals.filter(meal => meal.categories.map(category => category.name).includes(requiredMeal.value)).length < rules.filter(rule => rule.rule === "At least" && rule.type === "Category" && titleize(rule.value) === requiredMeal.value)[0].amount) ||
        //             (requiredMeal.type !== "Category" && selectedMeals.filter(meal => meal[requiredMeal.type.toLowerCase()] == requiredMeal.value).length < rules.filter(rule => rule.rule === "At least" && rule.type === requiredMeal.type && titleize(rule.value) === requiredMeal.value)[0].amount)
        //             ) {
        //             if (requiredMeal.type === "Category") {
        //                 mealChoices = meals.filter(meal => meal.categories.map(category => category.name).includes(requiredMeal.value))
        //             }
        //             else {
        //                 mealChoices = meals.filter(meal => meal[requiredMeal.type.toLowerCase()] == requiredMeal.value)
        //             }
    
        //             selectMeal(mealChoices)
        //         }
        //     }
        //     else {
        //         const rulesToCheck = [...requiredMeals, ...numberedRequiredMeals]
        //         rulesToCheck.forEach(ruleToCheck => {
        //             if (ruleToCheck.type === "Category") {
        //                 if (selectedMeals.filter(meal => meal.categories.map(category => category.name).includes(ruleToCheck.value)).length < ruleToCheck.amount) {
                            
        //                 }
        //             }
        //         })
        //         selectMeal(meals)
        //     }
        // }

        const selectedMealsData = generateMeals(user, number, rules)

        setGeneratedMeals(selectedMealsData.selectedMeals)
        setGeneratedProblem(selectedMealsData.problem)
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