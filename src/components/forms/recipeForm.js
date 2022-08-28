import React, { useContext, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import LoadingError from '../utils/loadingError'

export default function RecipeForm(props) {
    const [steps, setSteps] = useState([])
    const [stepsections, setStepsections] = useState([])
    const [ingredients, setIngredients] = useState([])
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

    const handleSubmit = async event => {
        event.preventDefault()

        setError("")

        if (!stepsections.every(stepsectionA => stepsections.filter(stepsectionB => stepsectionA.title === stepsectionB.title).length === 1)) {
            setError("Sorry, each section must have a unique title.")
        }
        else {
            setLoading(true)

            const capitalize = string => string.length > 0 ? string[0].toUpperCase() + string.slice(1).toLowerCase() : ""

            let stepsectionsData = []
            if (stepsections.length > 0) {
                const data = await fetch("https://whatsforsupperapi.herokuapp.com/stepsection/add/multiple", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(stepsections.map(stepsection => {
                        return {
                            title: capitalize(stepsection.title),
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
                    const stepsectionData = stepsectionsData.filter(stepsectionData => stepsectionData.title === capitalize(stepsection.title))[0]
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
                            text: capitalize(step.text),
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
                            name: capitalize(ingredient.name),
                            amount: capitalize(ingredient.amount),
                            category: capitalize(ingredient.category),
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

    return (
        <form className='form-wrapper recipe-form-wrapper'
            onSubmit={handleSubmit}
        >
            <h3>Add a Recipe</h3>
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
            <button type="submit" disabled={loading}>Add Recipe</button>
            <LoadingError loading={loading} error={error} />
        </form>
    )
}