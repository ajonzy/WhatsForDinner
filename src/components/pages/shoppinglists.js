import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'

import { UserContext } from '../app'

export default function Shoppinglists(props) {
    const { user } = useContext(UserContext)
    const [shoppinglistsList, setShoppinglistsList] = useState(user.shoppinglists)
    const [sharedShoppinglistsList, setSharedShoppinglistsList] = useState(user.shared_shoppinglists)

    const handleFilter = event => {
        setShoppinglistsList(user.shoppinglists.filter(shoppinglist => (
            shoppinglist.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
            shoppinglist.created_on.toLowerCase().includes(event.target.value.toLowerCase()) ||
            shoppinglist.shoppingingredients.map(ingredient => ingredient.name.toLowerCase()).filter(ingredient => ingredient.includes(event.target.value.toLowerCase())).length > 0
        )))

        setSharedShoppinglistsList(user.shared_shoppinglists.filter(shoppinglist => (
            shoppinglist.user_username.toLowerCase().includes(event.target.value.toLowerCase()) ||
            shoppinglist.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
            shoppinglist.created_on.toLowerCase().includes(event.target.value.toLowerCase()) ||
            shoppinglist.shoppingingredients.map(ingredient => ingredient.name.toLowerCase()).filter(ingredient => ingredient.includes(event.target.value.toLowerCase())).length > 0
        )))
    }

    const renderShoppinglists = () => {
        if (user.shoppinglists.length === 0 && user.shared_shoppinglists.length === 0) {
            return (
                <div className='no-content'>No mealplans here yet... Get adding!</div>
            )
        }

        const sharedShoppinglists = sharedShoppinglistsList.filter(shoppinglist => !shoppinglist.is_sublist).map(shoppinglist => (
            <div key={`shoppinglist-${shoppinglist.id}`} className="shoppinglist-wrapper-shared" onClick={() => props.history.push(`/shoppinglists/view/${shoppinglist.id}`)}>
                <p className='shared-by'>Shared by: {shoppinglist.user_username}</p>
                <p className='name'>{shoppinglist.name}</p>
                <p className='created-on'>{shoppinglist.created_on}</p>
            </div>
        ))

        const shoppinglists = shoppinglistsList.filter(shoppinglist => !shoppinglist.is_sublist).map(shoppinglist => (
            <div key={`shoppinglist-${shoppinglist.id}`} className="shoppinglist-wrapper" onClick={() => props.history.push(`/shoppinglists/view/${shoppinglist.id}`)}>
                <p className='name'>{shoppinglist.name}</p>
                <p className='created-on'>{shoppinglist.created_on}</p>
            </div>
        ))

        sharedShoppinglists.sort((shoppinglistA, shoppinglistB) => parseInt(shoppinglistA.key.split("-")[1]) > parseInt(shoppinglistB.key.split("-")[1]) ? -1 : 1)
        shoppinglists.sort((shoppinglistA, shoppinglistB) => parseInt(shoppinglistA.key.split("-")[1]) > parseInt(shoppinglistB.key.split("-")[1]) ? -1 : 1)

        return sharedShoppinglists.concat(shoppinglists)
    }

    return (
        <div className='page-wrapper shoppinglists-page-wrapper'>
            <h3>Shopping Lists</h3>
            <div className="options-wrapper">
                <Link to="/shoppinglists/add"><button>Add Shopping List</button></Link>
                <input type="text"
                    placeholder='Search: shopping list names, ingredients, etc.'
                    onChange={handleFilter}
                />
            </div>
            <div className={`shoppinglists-wrapper ${sharedShoppinglistsList.length > 0 ? "shared-active" : "shared-inactive"}`}>
                {renderShoppinglists()}
            </div>
        </div>
    )
}