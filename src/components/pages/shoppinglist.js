import React, { useContext, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faCircleCheck } from '@fortawesome/free-regular-svg-icons'

import ConfirmLoadingError from '../utils/confirmLoadingError'

import { UserContext } from '../app'

export default function Shoppinglist(props) {
    const { user, setUser } = useContext(UserContext)
    const [personal_shoppinglist] = useState(user.shoppinglists.filter(shoppinglist => shoppinglist.id === parseInt(props.match.params.id))[0])
    const [shared_shoppinglist] = useState(user.shared_shoppinglists.filter(shoppinglist => shoppinglist.id === parseInt(props.match.params.id))[0])
    const [shoppinglist, setShoppinglist] = useState(personal_shoppinglist || shared_shoppinglist)
    const [ingredientsSort, setIngredientsSort] = useState("arbitrary")
    const [confirm, setConfirm] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [deleteError, setDeleteError] = useState("")
    const [problem, setProblem] = useState(false)

    const handleDelete = () => {
        setDeleteError("")

        if (confirm) {
            setDeleteLoading(true)
            fetch(`https://whatsforsupperapi.herokuapp.com/shoppinglist/delete/${shoppinglist.id}`, { method: "DELETE" })
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    user.shoppinglists = user.shoppinglists.filter(shoppinglist => shoppinglist.id !== data.data.id)
                    setUser({...user})
                    props.history.push("/shoppinglists")
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
                console.log("Error deleting shoppinglist: ", error)
            })
        }
        else {
            setConfirm(true)
        }
    }

    const handleShareDelete = () => {
        setDeleteError("")

        if (confirm) {
            setDeleteLoading(true)
            fetch(`https://whatsforsupperapi.herokuapp.com/shoppinglist/unshare/${shoppinglist.id}/${user.id}`, { method: "DELETE" })
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    user.shared_shoppinglists = user.shared_shoppinglists.filter(shoppinglist => shoppinglist.id !== data.data.shoppinglist.id)
                    setUser({...user})
                    props.history.push("/shoppinglists")
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
                console.log("Error unsharing shoppinglist: ", error)
            })
        }
        else {
            setConfirm(true)
        }
    }

    const handleObtain = ingredient => {
        fetch(`https://whatsforsupperapi.herokuapp.com/shoppingingredient/update/${ingredient.id}`, {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                obtained: !ingredient.obtained
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status !== 200) {
                console.log(data)
                setProblem(true)
            }
        })
        .catch(error => {
            console.log("Error updating shoppinglist ingredient: ", error)
            setProblem(true)
        })

        ingredient.obtained = !ingredient.obtained
        setShoppinglist({...shoppinglist})
    }

    const renderIngredients = () => {
        let ingredients = [...shoppinglist.shoppingingredients]

        const renderIngredient = ingredient => (
            <div className={`ingredient-wrapper ${ingredient.obtained ? "obtained" : "unobtained"}`} key={`ingredient-${ingredient.id}`} onClick={() => handleObtain(ingredient)}>
                <p className='ingredient-amount'>{ingredient.amount}{ingredient.unit ? ` ${ingredient.unit}` : null}</p>
                <p className='ingredient-name'>{ingredient.name}</p>
            </div>
        )

        switch(ingredientsSort) {
            case "arbitrary": {
                ingredients.sort((ingredientA, ingredientB) => ingredientA.id - ingredientB.id)
                return ingredients.map(ingredient => renderIngredient(ingredient))
            }
            case "alphabetical": {
                ingredients.sort((ingredientA, ingredientB) => ingredientA.name < ingredientB.name ? -1 : 1)
                return ingredients.map(ingredient => renderIngredient(ingredient))
            }
            case "remaining": {
                ingredients.sort((ingredientA, ingredientB) => ingredientA.id - ingredientB.id)
                return ingredients.filter(ingredient => !ingredient.obtained).map(ingredient => renderIngredient(ingredient))
            }
            case "category": {
                ingredients.sort((ingredientA, ingredientB) => ingredientA.id - ingredientB.id)
                let categories = []
                ingredients.forEach(ingredient => {
                    if (!categories.includes(ingredient.category)) {
                        categories.push(ingredient.category)
                    }
                })
                categories.sort()
                if (categories[0] === "") {
                    categories.push(categories.shift())
                }
                return categories.map(category => (
                    <div className="shoppinglist-category-wrapper" key={`category-${category}`}>
                        <p className='category-name'>{category === "" ? "Uncategorized" : category}</p>
                        {ingredients.filter(ingredient => ingredient.category === category).map(ingredient => renderIngredient(ingredient))}
                    </div>
                ))
            }
        }
    }

    return (
        (shoppinglist 
            ? (
                <div className='page-wrapper shoppinglist-page-wrapper'>
                    <h2 className='name'>{shoppinglist.name}</h2>
                    <p className='created-on'>{shoppinglist.created_on}</p>
                    {shared_shoppinglist ? <p className='shared-by'>Shared by: {shoppinglist.user_username}</p> : null}
                    {shoppinglist.updates_hidden ? <p className='contains-gifts'>Contains Gifts</p> : null}
                    <h3>Items</h3>
                    {shoppinglist.shoppingingredients.length > 0
                        ? (
                            <div className="shoppinglist-ingredients-options-wrapper">
                                <p>Sort By</p>
                                <div className="ingredients-options-wrapper">
                                    <label>
                                        Alphabetical
                                        <input type="radio" 
                                            name="ingredient-option" 
                                            checked={ingredientsSort === "alphabetical"}
                                            onChange={() => setIngredientsSort("alphabetical")}
                                        />
                                        <span>{ingredientsSort === "alphabetical" ? <FontAwesomeIcon icon={faCircleCheck} /> : <FontAwesomeIcon icon={faCircle} />}</span>
                                    </label>
                                    <label>
                                        Category
                                        <input type="radio" 
                                            name="ingredient-option" 
                                            checked={ingredientsSort === "category"}
                                            onChange={() => setIngredientsSort("category")}
                                        />
                                        <span>{ingredientsSort === "category" ? <FontAwesomeIcon icon={faCircleCheck} /> : <FontAwesomeIcon icon={faCircle} />}</span>
                                    </label>
                                    <label>
                                        Remaining
                                        <input type="radio" 
                                            name="ingredient-option" 
                                            checked={ingredientsSort === "remaining"}
                                            onChange={() => setIngredientsSort("remaining")}
                                        />
                                        <span>{ingredientsSort === "remaining" ? <FontAwesomeIcon icon={faCircleCheck} /> : <FontAwesomeIcon icon={faCircle} />}</span>
                                    </label>
                                    <label>
                                        Arbitrary
                                        <input type="radio" 
                                            name="ingredient-option" 
                                            checked={ingredientsSort === "arbitrary"}
                                            onChange={() => setIngredientsSort("arbitrary")}
                                        />
                                        <span>{ingredientsSort === "arbitrary" ? <FontAwesomeIcon icon={faCircleCheck} /> : <FontAwesomeIcon icon={faCircle} />}</span>
                                    </label>
                                </div>
                            </div>
                        )
                        : null
                    }
                    <div className="shoppinglist-ingredients-wrapper">
                        {renderIngredients()}
                        <div className="spacer-30" />
                        {personal_shoppinglist && !shoppinglist.mealplan_id ? <button className='alt-button' onClick={() => props.history.push(`/shoppinglists/items/edit/${shoppinglist.id}`)}>{shoppinglist.shoppingingredients.length > 0 ? "Edit Items" : "Add Items"}</button> : null}
                    </div>
                    
                    <div className="options-wrapper">
                        {!shoppinglist.mealplan_id ? <h3>Shopping List Options</h3> : null}
                        {personal_shoppinglist && !shoppinglist.mealplan_id
                            ? (
                                <div className="edit-option-wrapper">
                                    <button className='alt-button' onClick={() => props.history.push(`/shoppinglists/edit/${shoppinglist.id}`)}>Edit Shopping List</button>
                                    <div className='spacer-30' />
                                </div>
                            )
                            : null
                        }
                        {personal_shoppinglist && !shoppinglist.mealplan_id
                            ? (
                                <div className="share-option-wrapper">
                                    <button className='alt-button' onClick={() => props.history.push(`/share/shoppinglist/${shoppinglist.id}`)}>Share Shopping List</button>
                                    <div className='spacer-30' />
                                </div>
                            )
                            : null
                        }
                        {personal_shoppinglist && !shoppinglist.mealplan_id
                            ? (
                                <div className="delete-option-wrapper">
                                    <button className='dangerous-button' onClick={handleDelete}>Delete Shopping List</button>
                                    <ConfirmLoadingError confirm={confirm} loading={deleteLoading} error={deleteError} item={shoppinglist.name} />
                                    <div className='spacer-30' />
                                </div>
                            )
                            : null
                        }
                        {shared_shoppinglist && !shoppinglist.mealplan_id
                            ? (
                                <div className="delete-option-wrapper">
                                    <button className='dangerous-button' onClick={handleShareDelete}>Delete Shopping List</button>
                                    <ConfirmLoadingError confirm={confirm} loading={deleteLoading} error={deleteError} item={shoppinglist.name} />
                                    <div className='spacer-30' />
                                </div>
                            )
                            : null
                        }
                        <button onClick={() => props.history.push("/shoppinglists")}>Back to Shopping Lists</button>
                    </div>
                </div>
            )
            : (
                <div className='page-wrapper mealplan-page-wrapper'>
                    <p className="not-found">Sorry, this shopping list does not exist...</p>
                    <div className="spacer-30" />
                    <div className="options-wrapper">
                        <button onClick={() => props.history.push("/shoppinglists")}>Back to Shopping Lists</button>
                    </div>
                </div>
            )
        )
    )
}