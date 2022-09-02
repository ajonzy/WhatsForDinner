import React, { useContext, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import LoadingError from '../utils/loadingError'

import titleize from '../../functions/titleize'

export default function RecipeForm(props) {
    if (props.edit) {
        props.meal.recipe.steps.sort((stepA, stepB) => stepA.id - stepB.id)
        props.meal.recipe.stepsections.sort((stepsectionA, stepsectionB) => stepsectionA.id - stepsectionB.id)
        props.meal.recipe.ingredients.sort((ingredientA, ingredientB) => ingredientA.id - ingredientB.id)
    }

    const [steps, setSteps] = useState(props.edit ? props.meal.recipe.steps.map(step => ({...step, stepsection: step.stepsection_id ? props.meal.recipe.stepsections.findIndex(stepsection => stepsection.id === step.stepsection_id) : undefined })) : [])
    const [stepsections, setStepsections] = useState(props.edit ? props.meal.recipe.stepsections.map(stepsection => ({...stepsection})) : [])
    const [ingredients, setIngredients] = useState(props.edit ? props.meal.recipe.ingredients.map(ingredient => ({...ingredient})) : [])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleStepChange = (event, step) => {
        step.text = event.target.value
        setSteps([...steps])
    }

    const handleStepDelete = step => {
        const index = steps.indexOf(step)
        steps.splice(index, 1)
        setSteps([...steps])
    }

    const handleStepsectionChange = (event, stepsection) => {
        stepsection.title = event.target.value
        setStepsections([...stepsections])
    }

    const handleStepsectionDelete = index => {
        stepsections.splice(index, 1)
        setStepsections([...stepsections])
        setSteps(steps.filter(step => step.stepsection !== index))
    }

    const handleIngredientChangeAmount = (event, ingredient) => {
        ingredient.amount = event.target.value
        setIngredients([...ingredients])
    }

    const handleIngredientChangeName = (event, ingredient) => {
        ingredient.name = event.target.value
        setIngredients([...ingredients])
    }

    const handleIngredientChangeCategory = (event, ingredient) => {
        ingredient.category = event.target.value
        setIngredients([...ingredients])
    }

    const handleIngredientDelete = index => {
        ingredients.splice(index, 1)
        setIngredients([...ingredients])
    }

    const handleAdd = async event => {
        event.preventDefault()

        setError("")

        if (!stepsections.every(stepsectionA => stepsections.filter(stepsectionB => stepsectionA.title === stepsectionB.title).length === 1)) {
            setError("Each section must have a unique title.")
        }
        else {
            setLoading(true)

            const capitalize = string => string.length > 0 ? string[0].toUpperCase() + string.slice(1) : ""

            let stepsectionsData = []
            if (stepsections.length > 0) {
                const data = await fetch("https://whatsforsupperapi.herokuapp.com/stepsection/add/multiple", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(stepsections.map(stepsection => {
                        return {
                            title: titleize(stepsection.title),
                            recipe_id: props.meal.recipe.id
                        }
                    }))
                })
                .then(response => response.json())
                .catch(error => {
                    return { catchError: error }
                })  
                if (data.status === 400) {
                    setError("An error occured... Please try again later.")
                    console.log(data)
                    setLoading(false)
                    return false
                }
                else if (data.catchError) {
                    setError("An error occured... Please try again later.")
                    setLoading(false)
                    console.log("Error adding stepsection: ", error)
                    return false
                }
                else if (data.status === 200) {
                    stepsectionsData = data.data
                }
                else {
                    setError("An error occured... Please try again later.")
                    console.log(data)
                    setLoading(false)
                    return false
                }
            }

            let stepsData = []
            if (steps.length > 0) {
                let count = 0
                let formattedSteps = steps.filter(step => step.stepsection === undefined).map(step => {
                    count++
                    return { ...step, number: count }
                })

                stepsections.forEach((stepsection, index) => {
                    const stepsectionData = stepsectionsData.filter(stepsectionData => stepsectionData.title === titleize(stepsection.title))[0]
                    let count = 0
                    formattedSteps = formattedSteps.concat(steps.filter(step => step.stepsection === index).map(step => {
                        count++
                        return { ...step, number: count, stepsection_id: stepsectionData.id }
                    }))
                })

                const data = await fetch("https://whatsforsupperapi.herokuapp.com/step/add/multiple", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(formattedSteps.map(step => {
                        return {
                            number: step.number,
                            text: capitalize(step.text).trim(),
                            stepsection_id: step.stepsection_id,
                            recipe_id: props.meal.recipe.id
                        }
                    }))
                })
                .then(response => response.json())
                .catch(error => {
                    return { catchError: error }
                })  
                if (data.status === 400) {
                    setError("An error occured... Please try again later.")
                    console.log(data)
                    setLoading(false)
                    return false
                }
                else if (data.catchError) {
                    setError("An error occured... Please try again later.")
                    setLoading(false)
                    console.log("Error adding step: ", error)
                    return false
                }
                else if (data.status === 200) {
                    stepsData = data.data
                }
                else {
                    setError("An error occured... Please try again later.")
                    console.log(data)
                    setLoading(false)
                    return false
                }
            }

            let ingredientsData = []
            if (ingredients.length > 0) {
                const data = await fetch("https://whatsforsupperapi.herokuapp.com/ingredient/add/multiple", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(ingredients.map(ingredient => {
                        return {
                            name: titleize(ingredient.name),
                            amount: titleize(ingredient.amount),
                            category: titleize(ingredient.category),
                            recipe_id: props.meal.recipe.id
                        }
                    }))
                })
                .then(response => response.json())
                .catch(error => {
                    return { catchError: error }
                })  
                if (data.status === 400) {
                    setError("An error occured... Please try again later.")
                    console.log(data)
                    setLoading(false)
                    return false
                }
                else if (data.catchError) {
                    setError("An error occured... Please try again later.")
                    setLoading(false)
                    console.log("Error adding ingredient: ", error)
                    return false
                }
                else if (data.status === 200) {
                    ingredientsData = data.data
                }
                else {
                    setError("An error occured... Please try again later.")
                    console.log(data)
                    setLoading(false)
                    return false
                }
            }

            const meal = props.meal
            stepsData.forEach(step => {
                if (step.stepsection_id) {
                    stepsectionsData.filter(stepsection => stepsection.id === step.stepsection_id)[0].steps.push(step)
                }
            })
            meal.recipe.stepsections = stepsectionsData
            meal.recipe.steps = stepsData
            meal.recipe.ingredients = ingredientsData
            props.handleSuccessfulSubmit(meal)
        } 
    }

    const handleEdit = async event => {
        event.preventDefault()

        setError("")

        if (!stepsections.every(stepsectionA => stepsections.filter(stepsectionB => stepsectionA.title === stepsectionB.title).length === 1)) {
            setError("Each section must have a unique title.")
        }
        else {
            setLoading(true)

            const capitalize = string => string.length > 0 ? string[0].toUpperCase() + string.slice(1) : ""

            const newStepsections = stepsections.filter(stepsection => !stepsection.id)
            const existingStepsections = stepsections.filter(stepsection => props.meal.recipe.stepsections.filter(existingStepsection => existingStepsection.id === stepsection.id).length > 0)
            const updatedStepsections = existingStepsections.filter(existingStepsection => existingStepsection.title !== props.meal.recipe.stepsections.filter(stepsection => stepsection.id === existingStepsection.id)[0].title)
            const nonUpdatedStepsections = existingStepsections.filter(existingStepsection => existingStepsection.title === props.meal.recipe.stepsections.filter(stepsection => stepsection.id === existingStepsection.id)[0].title)
            const deletedStepsections = props.meal.recipe.stepsections.filter(existingStepsection => stepsections.filter(stepsection => stepsection.id === existingStepsection.id).length === 0)
            let stepsectionsData = [...nonUpdatedStepsections]
            if (newStepsections.length > 0) {
                const data = await fetch("https://whatsforsupperapi.herokuapp.com/stepsection/add/multiple", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(newStepsections.map(stepsection => {
                        return {
                            title: titleize(stepsection.title),
                            recipe_id: props.meal.recipe.id
                        }
                    }))
                })
                .then(response => response.json())
                .catch(error => {
                    return { catchError: error }
                })  
                if (data.status === 400) {
                    setError("An error occured... Please try again later.")
                    console.log(data)
                    setLoading(false)
                    return false
                }
                else if (data.catchError) {
                    setError("An error occured... Please try again later.")
                    setLoading(false)
                    console.log("Error adding stepsection: ", error)
                    return false
                }
                else if (data.status === 200) {
                    stepsectionsData = stepsectionsData.concat(data.data)
                }
                else {
                    setError("An error occured... Please try again later.")
                    console.log(data)
                    setLoading(false)
                    return false
                }
            }

            if (updatedStepsections.length > 0) {
                for (let stepsection of updatedStepsections) {
                    const data = await fetch(`https://whatsforsupperapi.herokuapp.com/stepsection/update/${stepsection.id}`, {
                        method: "PUT",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({
                            title: titleize(stepsection.title)
                        })
                    })
                    .then(response => response.json())
                    .catch(error => {
                        return { catchError: error }
                    })  
                    if (data.status === 400) {
                        setError("An error occured... Please try again later.")
                        console.log(data)
                        setLoading(false)
                        return false
                    }
                    else if (data.catchError) {
                        setError("An error occured... Please try again later.")
                        setLoading(false)
                        console.log("Error updating stepsection: ", error)
                        return false
                    }
                    else if (data.status === 200) {
                        stepsectionsData.push(data.data)
                    }
                    else {
                        setError("An error occured... Please try again later.")
                        console.log(data)
                        setLoading(false)
                        return false
                    }
                }
            }

            if (deletedStepsections.length > 0) {
                for (let stepsection of deletedStepsections) {
                    const data = await fetch(`https://whatsforsupperapi.herokuapp.com/stepsection/delete/${stepsection.id}`, {
                        method: "DELETE"
                    })
                    .then(response => response.json())
                    .catch(error => {
                        return { catchError: error }
                    })  
                    if (data.catchError) {
                        setError("An error occured... Please try again later.")
                        setLoading(false)
                        console.log("Error deleting stepsection: ", error)
                        return false
                    }
                    else if (data.status !== 200) {
                        setError("An error occured... Please try again later.")
                        console.log(data)
                        setLoading(false)
                        return false
                    }
                }
            }

            let count = 0
            let formattedSteps = steps.filter(step => step.stepsection === undefined).map(step => {
                count++
                return { ...step, number: count }
            })

            stepsections.forEach((stepsection, index) => {
                const stepsectionData = stepsectionsData.filter(stepsectionData => stepsectionData.title === titleize(stepsection.title))[0]
                let count = 0
                formattedSteps = formattedSteps.concat(steps.filter(step => step.stepsection === index).map(step => {
                    count++
                    return { ...step, number: count, stepsection_id: stepsectionData.id }
                }))
            })

            const newSteps = formattedSteps.filter(step => !step.id)
            const existingSteps = formattedSteps.filter(step => props.meal.recipe.steps.filter(existingStep => existingStep.id === step.id).length > 0)
            const updatedSteps = existingSteps.filter(existingStep => existingStep.text !== props.meal.recipe.steps.filter(step => step.id === existingStep.id)[0].text || existingStep.number !== props.meal.recipe.steps.filter(step => step.id === existingStep.id)[0].number)
            const nonUpdatedSteps = existingSteps.filter(existingStep => existingStep.text === props.meal.recipe.steps.filter(step => step.id === existingStep.id)[0].text && existingStep.number === props.meal.recipe.steps.filter(step => step.id === existingStep.id)[0].number)
            const deletedSteps = props.meal.recipe.steps.filter(existingStep => formattedSteps.filter(step => step.id === existingStep.id).length === 0)
            let stepsData = [...nonUpdatedSteps]
            if (newSteps.length > 0) {
                let count = existingSteps.filter(step => step.stepsection === undefined).length
                let formattedSteps = newSteps.filter(step => step.stepsection === undefined).map(step => {
                    count++
                    return { ...step, number: count }
                })

                stepsections.forEach((stepsection, index) => {
                    const stepsectionData = stepsectionsData.filter(stepsectionData => stepsectionData.title === titleize(stepsection.title))[0]
                    let count = existingSteps.filter(step => step.stepsection === index).length
                    formattedSteps = formattedSteps.concat(newSteps.filter(step => step.stepsection === index).map(step => {
                        count++
                        return { ...step, number: count, stepsection_id: stepsectionData.id }
                    }))
                })

                const data = await fetch("https://whatsforsupperapi.herokuapp.com/step/add/multiple", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(formattedSteps.map(step => {
                        return {
                            number: step.number,
                            text: capitalize(step.text).trim(),
                            stepsection_id: step.stepsection_id,
                            recipe_id: props.meal.recipe.id
                        }
                    }))
                })
                .then(response => response.json())
                .catch(error => {
                    return { catchError: error }
                })  
                if (data.status === 400) {
                    setError("An error occured... Please try again later.")
                    console.log(data)
                    setLoading(false)
                    return false
                }
                else if (data.catchError) {
                    setError("An error occured... Please try again later.")
                    setLoading(false)
                    console.log("Error adding step: ", error)
                    return false
                }
                else if (data.status === 200) {
                    stepsData = stepsData.concat(data.data)
                }
                else {
                    setError("An error occured... Please try again later.")
                    console.log(data)
                    setLoading(false)
                    return false
                }
            }

            if (updatedSteps.length > 0) {
                for (let step of updatedSteps) {
                    const data = await fetch(`https://whatsforsupperapi.herokuapp.com/step/update/${step.id}`, {
                        method: "PUT",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({
                            number: step.number,
                            text: capitalize(step.text).trim()
                        })
                    })
                    .then(response => response.json())
                    .catch(error => {
                        return { catchError: error }
                    })  
                    if (data.status === 400) {
                        setError("An error occured... Please try again later.")
                        console.log(data)
                        setLoading(false)
                        return false
                    }
                    else if (data.catchError) {
                        setError("An error occured... Please try again later.")
                        setLoading(false)
                        console.log("Error updating step: ", error)
                        return false
                    }
                    else if (data.status === 200) {
                        stepsData.push(data.data)
                    }
                    else {
                        setError("An error occured... Please try again later.")
                        console.log(data)
                        setLoading(false)
                        return false
                    }
                }
            }

            if (deletedSteps.length > 0) {
                for (let step of deletedSteps) {
                    const data = await fetch(`https://whatsforsupperapi.herokuapp.com/step/delete/${step.id}`, {
                        method: "DELETE"
                    })
                    .then(response => response.json())
                    .catch(error => {
                        return { catchError: error }
                    })  
                    if (data.catchError) {
                        setError("An error occured... Please try again later.")
                        setLoading(false)
                        console.log("Error deleting step: ", error)
                        return false
                    }
                    else if (data.status !== 200) {
                        setError("An error occured... Please try again later.")
                        console.log(data)
                        setLoading(false)
                        return false
                    }
                }
            }

            const newIngredients = ingredients.filter(ingredient => !ingredient.id)
            const existingIngredients = ingredients.filter(ingredient => props.meal.recipe.ingredients.filter(existingIngredient => existingIngredient.id === ingredient.id).length > 0)
            const updatedIngredients = existingIngredients.filter(existingIngredient => existingIngredient.amount !== props.meal.recipe.ingredients.filter(ingredient => ingredient.id === existingIngredient.id)[0].amount || existingIngredient.name !== props.meal.recipe.ingredients.filter(ingredient => ingredient.id === existingIngredient.id)[0].name || existingIngredient.category !== props.meal.recipe.ingredients.filter(ingredient => ingredient.id === existingIngredient.id)[0].category)
            const nonUpdatedIngredients = existingIngredients.filter(existingIngredient => existingIngredient.amount === props.meal.recipe.ingredients.filter(ingredient => ingredient.id === existingIngredient.id)[0].amount && existingIngredient.name === props.meal.recipe.ingredients.filter(ingredient => ingredient.id === existingIngredient.id)[0].name && existingIngredient.category === props.meal.recipe.ingredients.filter(ingredient => ingredient.id === existingIngredient.id)[0].category)
            const deletedIngredients = props.meal.recipe.ingredients.filter(existingIngredient => ingredients.filter(ingredient => ingredient.id === existingIngredient.id).length === 0)
            let ingredientsData = [...nonUpdatedIngredients]
            if (newIngredients.length > 0) {
                const data = await fetch("https://whatsforsupperapi.herokuapp.com/ingredient/add/multiple", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(newIngredients.map(ingredient => {
                        return {
                            name: titleize(ingredient.name),
                            amount: titleize(ingredient.amount),
                            category: titleize(ingredient.category),
                            recipe_id: props.meal.recipe.id
                        }
                    }))
                })
                .then(response => response.json())
                .catch(error => {
                    return { catchError: error }
                })  
                if (data.status === 400) {
                    setError("An error occured... Please try again later.")
                    console.log(data)
                    setLoading(false)
                    return false
                }
                else if (data.catchError) {
                    setError("An error occured... Please try again later.")
                    setLoading(false)
                    console.log("Error adding ingredient: ", error)
                    return false
                }
                else if (data.status === 200) {
                    ingredientsData = ingredientsData.concat(data.data)
                }
                else {
                    setError("An error occured... Please try again later.")
                    console.log(data)
                    setLoading(false)
                    return false
                }
            }

            if (updatedIngredients.length > 0) {
                for (let ingredient of updatedIngredients) {
                    const data = await fetch(`https://whatsforsupperapi.herokuapp.com/ingredient/update/${ingredient.id}`, {
                        method: "PUT",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({
                            name: titleize(ingredient.name),
                            amount: titleize(ingredient.amount),
                            category: titleize(ingredient.category)
                        })
                    })
                    .then(response => response.json())
                    .catch(error => {
                        return { catchError: error }
                    })  
                    if (data.status === 400) {
                        setError("An error occured... Please try again later.")
                        console.log(data)
                        setLoading(false)
                        return false
                    }
                    else if (data.catchError) {
                        setError("An error occured... Please try again later.")
                        setLoading(false)
                        console.log("Error updating ingredient: ", error)
                        return false
                    }
                    else if (data.status === 200) {
                        ingredientsData.push(data.data)
                    }
                    else {
                        setError("An error occured... Please try again later.")
                        console.log(data)
                        setLoading(false)
                        return false
                    }
                }
            }

            if (deletedIngredients.length > 0) {
                for (let ingredient of deletedIngredients) {
                    const data = await fetch(`https://whatsforsupperapi.herokuapp.com/ingredient/delete/${ingredient.id}`, {
                        method: "DELETE"
                    })
                    .then(response => response.json())
                    .catch(error => {
                        return { catchError: error }
                    })  
                    if (data.catchError) {
                        setError("An error occured... Please try again later.")
                        setLoading(false)
                        console.log("Error deleting ingredient: ", error)
                        return false
                    }
                    else if (data.status !== 200) {
                        setError("An error occured... Please try again later.")
                        console.log(data)
                        setLoading(false)
                        return false
                    }
                }
            }

            const meal = props.meal
            stepsectionsData.forEach(stepsection => {
                stepsection.steps = []
            })
            stepsData.forEach(step => {
                if (step.stepsection_id) {
                    stepsectionsData.filter(stepsection => stepsection.id === step.stepsection_id)[0].steps.push(step)
                }
            })
            meal.recipe.stepsections = stepsectionsData
            meal.recipe.steps = stepsData
            meal.recipe.ingredients = ingredientsData
            props.handleSuccessfulSubmit(meal)
        }
    }

    return (
        <form className='form-wrapper recipe-form-wrapper'
            onSubmit={props.edit ? handleEdit : handleAdd}
        >
            <h3>{props.edit ? `Edit ${props.meal.name} Recipe` : "Add a Recipe"}</h3>
            <h4>Ingredients</h4>
            {ingredients.map((ingredient, index) => (
                <div className="ingredient-wrapper" key={`ingredient-${index}`}>
                    <button type='button' disabled={loading} className='icon-button' onClick={() => handleIngredientDelete(index)}><FontAwesomeIcon icon={faTimesCircle} /></button>
                    <input type="text" 
                        value={ingredient.amount}
                        placeholder="Amount"
                        onChange={event => handleIngredientChangeAmount(event, ingredient)}
                        required
                    />
                    <input type="text" 
                        value={ingredient.name}
                        placeholder="Ingredient"
                        onChange={event => handleIngredientChangeName(event, ingredient)}
                        required
                    />
                    <input type="text" 
                        value={ingredient.category}
                        placeholder="Category: produce, dairy, etc. (Optional)"
                        onChange={event => handleIngredientChangeCategory(event, ingredient)}
                    />
                </div>
            ))}
            <button type='button' disabled={loading} className='alt-button' onClick={() => setIngredients([...ingredients, { amount: "", name: "", category: "" }])}>Add Ingredient</button>

            <h4>Steps</h4>
            {steps.filter(step => step.stepsection === undefined).map((step, index) => (
                <div className="step-wrapper" key={`step-${index}`}>
                    <TextareaAutosize 
                        value={step.text}
                        placeholder="Step"
                        onChange={event => handleStepChange(event, step)}
                        minRows="6"
                        required
                    />
                    <button type='button' disabled={loading} className='icon-button' onClick={() => handleStepDelete(step)}><FontAwesomeIcon icon={faTimesCircle} /></button>
                </div>
            ))}
            <button type='button' disabled={loading} className='alt-button' onClick={() => setSteps([...steps, { text: "" }])}>Add Step</button>
            <div className='spacer-40' />
            {stepsections.map((stepsection, index) => (
                <div className="stepsection-wrapper" key={`stepsection-${index}`}>
                    <button type='button' disabled={loading} className='icon-button' onClick={() => handleStepsectionDelete(index)}><FontAwesomeIcon icon={faTimesCircle} /></button>
                    <input type="text" 
                        value = {stepsection.title}
                        placeholder = "Section Title"
                        onChange={event => handleStepsectionChange(event, stepsection)}
                        required
                    />
                    {steps.filter(step => step.stepsection === index).map((step, stepIndex) => (
                        <div className="step-wrapper" key={`step-${index}-${stepIndex}`}>
                            <TextareaAutosize 
                                value={step.text}
                                placeholder="Step"
                                onChange={event => handleStepChange(event, step)}
                                minRows="6"
                                required
                            />
                            <button type='button' disabled={loading} className='icon-button' onClick={() => handleStepDelete(step)}><FontAwesomeIcon icon={faTimesCircle} /></button>
                        </div>
                    ))}
                    <button type='button' disabled={loading} className='alt-button' onClick={() => setSteps([...steps, { text: "", stepsection: index }])}>Add Step</button>
                </div>
            ))}
            <button type='button' disabled={loading} className='alt-button' onClick={() => setStepsections([...stepsections, { title: "" }])}>Add Section</button>
            <div className='spacer-40' />
            <button type="submit" disabled={loading}>{props.edit ? "Edit Recipe" : "Add Recipe"}</button>
            <LoadingError loading={loading} error={error} />
        </form>
    )
}