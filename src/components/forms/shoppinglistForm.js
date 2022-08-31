import React, { useContext, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare, faSquareCheck } from '@fortawesome/free-regular-svg-icons'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import LoadingError from '../utils/loadingError'

import { UserContext } from '../app'

import titleize from '../../functions/titleize'

export default function ShoppinglistForm(props) {
    const { user } = useContext(UserContext)
    const [name, setName] = useState("")
    const [updatesHidden, setUpdatesHidden] = useState(false)
    const [ingredients, setIngredients] = useState([])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

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

        if (name === "") {
            setError("Please fill out all required fields.")
        }
        else {
            setLoading(true)

            let newData = []
            let data = await fetch("https://whatsforsupperapi.herokuapp.com/shoppinglist/add", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    name: titleize(name),
                    updates_hidden: updatesHidden,
                    created_on: new Date().toLocaleDateString(),
                    user_username: user.username,
                    user_id: user.id
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
                console.log("Error adding shoppinglist: ", error)
                return false
            }
            else if (data.status === 200) {
                newData = data.data
            }
            else {
                setError("An error occured... Please try again later.")
                console.log(data)
                setLoading(false)
                return false
            }

            let ingredientsData = []
            if (ingredients.length > 0) {
                const data = await fetch("https://whatsforsupperapi.herokuapp.com/shoppingingredient/add/multiple", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(ingredients.map(ingredient => {
                        return {
                            name: titleize(ingredient.name),
                            amount: titleize(ingredient.amount),
                            category: titleize(ingredient.category),
                            shoppinglist_id: newData.id
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
                    console.log("Error adding shopping ingredient: ", error)
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

            newData.shoppingingredients = ingredientsData
            props.handleSuccessfulAddShoppinglist(newData)
        }
    }

    return (
        <form className='form-wrapper shoppinglist-form-wrapper'
            onSubmit={handleSubmit}
        >
            <h3>Add a Shopping List</h3>
            <input type="text" 
                value={name}
                placeholder="Shopping list name"
                onChange={event => setName(event.target.value)}
                required
            />
            <label>
                Contains Gifts
                <input type="checkbox" 
                    checked={updatesHidden}
                    onChange={event => setUpdatesHidden(event.target.checked)} 
                />
                <span>{updatesHidden ? <FontAwesomeIcon icon={faSquareCheck} /> : <FontAwesomeIcon icon={faSquare} />}</span>
            </label>
            <h4>Shopping Items</h4>
            <div className="ingredients-wrapper">
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
                            placeholder="Name"
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
                <button type='button' disabled={loading} className='alt-button' onClick={() => setIngredients([...ingredients, { amount: "", name: "", category: "" }])}>Add Item</button>
            </div>
            <div className='spacer-40' />
            <button type="submit" disabled={loading}>Add Shopping List</button>
            <LoadingError loading={loading} error={error} />
        </form>
    )
}