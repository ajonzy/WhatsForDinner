import React, { useContext, useState } from 'react'

import { UserContext } from '../app'
import ConfirmLoadingError from '../utils/confirmLoadingError'
import LoadingError from '../utils/loadingError'

export default function Meal(props) {
    const { user, setUser } = useContext(UserContext)
    const [personal_meal] = useState(user.meals.filter(meal => meal.id === parseInt(props.match.params.id))[0])
    const [shared_meal] = useState(user.shared_meals.filter(meal => meal.id === parseInt(props.match.params.id))[0])
    const [meal] = useState(personal_meal || shared_meal)
    const [confirm, setConfirm] = useState(false)
    const [copyLoading, setCopyLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [deleteError, setDeleteError] = useState("")
    const [copyError, setCopyError] = useState("")

    const renderSteps = () => {
        const stepElements = []

        const basicSteps = meal.recipe.steps.filter(step => !step.stepsection_id)
        basicSteps.sort((stepA, stepB) => stepA.number - stepB.number)
        basicSteps.forEach(step => stepElements.push(
            <div className="step-wrapper" key={`step-${step.id}`}>
                <p className='step-number'>{step.number}.</p>
                <p>{step.text}</p>
            </div>
        ))

        stepElements.push(<div className='spacer-40'key={`spacer`} />)

        meal.recipe.stepsections.forEach(stepsection => {
            stepsection.steps.sort((stepA, stepB) => stepA.number - stepB.number)
            stepElements.push(
                <div className="stepsection-wrapper" key={`stepsection-${stepsection.id}`}>
                    <p className='stepsection-title'>{stepsection.title}</p>
                    {stepsection.steps.map(step => (
                        <div className="step-wrapper" key={`step-${step.id}`}>
                            <p className='step-number'>{step.number}.</p>
                            <p>{step.text}</p>
                        </div>
                    ))}
                </div>
            )
        })

        return stepElements
    }

    const handleDelete = () => {
        setDeleteError("")

        if (confirm) {
            setDeleteLoading(true)
            fetch(`https://whatsfordinnerapi.herokuapp.com/meal/delete/${meal.id}`, { method: "DELETE" })
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    user.meals = user.meals.filter(meal => meal.id !== data.data.id)
                    setUser({...user})
                    props.history.push("/meals")
                }
                else {
                    setDeleteError("An error occured... Please try again later.")
                    console.log(data)
                    setDeleteLoading(false)
                }
            })
            .catch(error => {
                setDeleteError("An error occured... Please try again later.")
                setDeleteLoading(false)
                console.log("Error deleting meal: ", error)
            })
        }
        else {
            setConfirm(true)
        }
    }

    const handleCopy = async () => {
        setCopyError("")
        setCopyLoading(true)

        let newData = {}
        let data = await fetch("https://whatsfordinnerapi.herokuapp.com/meal/add", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                name: meal.name,
                difficulty: meal.difficulty,
                description: meal.description,
                image_url: meal.image_url,
                user_id: user.id
            })
        })
        .then(response => response.json())
        .catch(error => {
            return { catchError: error }
        })
        if (data.status === 400) {
            setCopyError("An error occured... Please try again later.")
            console.log(data)
            setCopyLoading(false)
            return false
        }
        else if (data.catchError) {
            setCopyError("An error occured... Please try again later.")
            setCopyLoading(false)
            console.log("Error adding meal: ", error)
            return false
        }
        else if (data.status === 200) {
            newData = data.data
        }
        else {
            setCopyError("An error occured... Please try again later.")
            console.log(data)
            setCopyLoading(false)
            return false
        }

        if (meal.recipe.stepsections.length > 0) {
            const data = await fetch("https://whatsfordinnerapi.herokuapp.com/stepsection/add/multiple", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(meal.recipe.stepsections.map(stepsection => {
                    return {
                        title: stepsection.title,
                        recipe_id: newData.recipe.id
                    }
                }))
            })
            .then(response => response.json())
            .catch(error => {
                return { catchError: error }
            })  
            if (data.status === 400) {
                setCopyError("An error occured... Please try again later.")
                console.log(data)
                setCopyLoading(false)
                return false
            }
            else if (data.catchError) {
                setCopyError("An error occured... Please try again later.")
                setCopyLoading(false)
                console.log("Error adding stepsection: ", error)
                return false
            }
            else if (data.status === 200) {
                newData.recipe.stepsections = data.data
            }
            else {
                setCopyError("An error occured... Please try again later.")
                console.log(data)
                setCopyLoading(false)
                return false
            }
        }

        if (meal.recipe.steps.length > 0) {
            const data = await fetch("https://whatsfordinnerapi.herokuapp.com/step/add/multiple", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(meal.recipe.steps.map(step => {
                    return {
                        number: step.number,
                        text: step.text,
                        stepsection_id: step.stepsection_id,
                        recipe_id: newData.recipe.id
                    }
                }))
            })
            .then(response => response.json())
            .catch(error => {
                return { catchError: error }
            })  
            if (data.status === 400) {
                setCopyError("An error occured... Please try again later.")
                console.log(data)
                setCopyLoading(false)
                return false
            }
            else if (data.catchError) {
                setCopyError("An error occured... Please try again later.")
                setCopyLoading(false)
                console.log("Error adding step: ", error)
                return false
            }
            else if (data.status === 200) {
                newData.recipe.steps = data.data
            }
            else {
                setCopyError("An error occured... Please try again later.")
                console.log(data)
                setCopyLoading(false)
                return false
            }
        }

        if (meal.recipe.ingredients.length > 0) {
            const data = await fetch("https://whatsfordinnerapi.herokuapp.com/ingredient/add/multiple", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(meal.recipe.ingredients.map(ingredient => {
                    return {
                        name: ingredient.name,
                        amount: ingredient.amount,
                        category: ingredient.category,
                        recipe_id: newData.recipe.id
                    }
                }))
            })
            .then(response => response.json())
            .catch(error => {
                return { catchError: error }
            })  
            if (data.status === 400) {
                setCopyError("An error occured... Please try again later.")
                console.log(data)
                setCopyLoading(false)
                return false
            }
            else if (data.catchError) {
                setCopyError("An error occured... Please try again later.")
                setCopyLoading(false)
                console.log("Error adding ingredient: ", error)
                return false
            }
            else if (data.status === 200) {
                newData.recipe.ingredients = data.data
            }
            else {
                setCopyError("An error occured... Please try again later.")
                console.log(data)
                setCopyLoading(false)
                return false
            }
        }

        let unshareData = {}
        data = await fetch(`https://whatsfordinnerapi.herokuapp.com/meal/unshare/${meal.id}/${user.id}`, { method: "DELETE" })
        .then(response => response.json())
        .catch(error => {
            return { catchError: error }
        }) 
        if (data.catchError) {
            setCopyError("An error occured... Please try again later.")
            setCopyLoading(false)
            console.log("Error unsharing meal: ", error)
            return false
        }
        else if (data.status === 200) {
            unshareData = data.data
        }
        else {
            setCopyError("An error occured... Please try again later.")
            console.log(data)
            setCopyLoading(false)
            return false
        }

        user.meals.push(newData)
        user.shared_meals = user.shared_meals.filter(meal => meal.id !== unshareData.meal.id)
        setUser({...user})
        props.history.push("/meals")
    }

    const handleShareDelete = () => {
        setDeleteError("")

        if (confirm) {
            setDeleteLoading(true)
            fetch(`https://whatsfordinnerapi.herokuapp.com/meal/unshare/${meal.id}/${user.id}`, { method: "DELETE" })
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    user.shared_meals = user.shared_meals.filter(meal => meal.id !== data.data.meal.id)
                    setUser({...user})
                    props.history.push("/meals")
                }
                else {
                    setDeleteError("An error occured... Please try again later.")
                    console.log(data)
                    setDeleteLoading(false)
                }
            })
            .catch(error => {
                setDeleteError("An error occured... Please try again later.")
                setDeleteLoading(false)
                console.log("Error unsharing meal: ", error)
            })
        }
        else {
            setConfirm(true)
        }
    }

    return (
        (meal 
            ? (
                <div className='page-wrapper meal-page-wrapper'>
                    <h2 className='name'>{meal.name}</h2>
                    {shared_meal ? <p className='shared-by'>Shared by: {meal.user_username}</p> : null}
                    {meal.difficulty > 0 ? <p className='difficulty'>Difficulty: <span>{"★".repeat(meal.difficulty)}</span></p> : null}
                    {meal.image_url ? <img src={meal.image_url} alt="" /> : null}
                    {meal.description ? <p className='description'>{meal.description}</p> : null}
                    {personal_meal && meal.categories.length > 0 
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

                    {meal.recipe.steps.length > 0 || meal.recipe.ingredients.length > 0
                        ? (
                            <div className="meal-recipe-wrapper">
                                <h3>Recipe</h3>
                                {meal.recipe.ingredients.length > 0
                                    ? (
                                        <div className="recipe-ingredients-wrapper">
                                            <h4>Ingredients</h4>
                                            {meal.recipe.ingredients.map(ingredient => (
                                                <div className="ingredient-wrapper" key={`ingredient-${ingredient.id}`}>
                                                    <p className='ingredient-amount'>{ingredient.amount}</p>
                                                    <p>{ingredient.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                    : null
                                }
                                {meal.recipe.steps.length > 0
                                    ? (
                                        <div className="recipe-steps-wrapper">
                                            <h4>Steps</h4>
                                            {renderSteps()}
                                        </div>
                                    )
                                    : null
                                }
                            </div>
                        )
                        : null
                    }
                    <div className="options-wrapper">
                        {personal_meal
                            ? (
                                <div className="delete-option-wrapper">
                                    <button className='dangerous-button' onClick={handleDelete}>Delete Meal</button>
                                    <ConfirmLoadingError confirm={confirm} loading={deleteLoading} error={deleteError} item={meal.name} />
                                    <div className='spacer-30' />
                                </div>
                            )
                            : null
                        }
                        {shared_meal
                            ? (
                                <div className="add-option-wrapper">
                                    <button className='alt-button' onClick={handleCopy}>Copy Meal</button>
                                    <LoadingError loading={copyLoading} error={copyError} />
                                    <div className='spacer-30' />
                                </div>
                            )
                            : null
                        }
                        {shared_meal
                            ? (
                                <div className="delete-option-wrapper">
                                    <button className='dangerous-button' onClick={handleShareDelete}>Delete Meal</button>
                                    <ConfirmLoadingError confirm={confirm} loading={deleteLoading} error={deleteError} item={meal.name} />
                                    <div className='spacer-30' />
                                </div>
                            )
                            : null
                        }
                        <button onClick={() => props.history.push("/meals")}>Back to Meals</button>
                    </div>
                </div>
            )
            : (
                <div className='page-wrapper meal-page-wrapper'>
                    <p className="not-found">Sorry, this meal does not exist...</p>
                    <div className="spacer-30" />
                    <div className="options-wrapper">
                        <button onClick={() => props.history.push("/meals")}>Back to Meals</button>
                    </div>
                </div>
            )
        )
    )
}