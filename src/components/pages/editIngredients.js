import React, { useContext, useState } from 'react'

import ShoppinglistForm from '../forms/shoppinglistForm'

import { UserContext } from '../app'

export default function EditShoppingingredients(props) {
    const { user, setUser } = useContext(UserContext)
    const [shoppinglist] = useState(user.shoppinglists.filter(shoppinglist => shoppinglist.id === parseInt(props.match.params.id))[0])

    const handleSuccessfulSubmit = data => {
        if (data.mealplan_id) {
            const mealplan = user.mealplans.filter(mealplan => mealplan.id === data.mealplan_id)[0]

            if (data.shoppingingredients.length > 0 && Object.keys(mealplan.sub_shoppinglist).length === 0) {
                mealplan.sub_shoppinglist = data
                user.shoppinglists.push(data)
            }
            else if (data.shoppingingredients.length > 0 && Object.keys(mealplan.sub_shoppinglist).length > 0) {
                mealplan.sub_shoppinglist = data
                user.shoppinglists.splice(user.shoppinglists.findIndex(shoppinglist => shoppinglist.id === data.id), 1, data)
            }
            else if (data.shoppingingredients.length === 0 && Object.keys(mealplan.sub_shoppinglist).length > 0) {
                mealplan.sub_shoppinglist = {}
                user.shoppinglists.splice(user.shoppinglists.findIndex(shoppinglist => shoppinglist.id === data.id), 1)
            }
                   
            data = mealplan.shoppinglist
        }
        else {
            user.shoppinglists.splice(user.shoppinglists.findIndex(shoppinglist => shoppinglist.id === data.id), 1, data)
        }
        setUser({...user})
        props.history.push(`/shoppinglists/view/${data.id}`)
    }

    return (
        (shoppinglist && !shoppinglist.is_sublist
            ? (
                <div className='page-wrapper edit-shoppingingredients-page-wrapper'>
                    <ShoppinglistForm shoppinglist={shoppinglist} edit editShoppingingredients handleSuccessfulSubmit={handleSuccessfulSubmit} />
                    <div className="options-wrapper">
                        <div className="spacer-40" />
                        <button onClick={() => props.history.push(`/shoppinglists/view/${shoppinglist.id}`)}>Cancel</button>
                    </div>
                </div>
            )
            : (
                <div className='page-wrapper edit-shoppingingredients-page-wrapper'>
                    <p className="not-found">Sorry, this shopping list does not exist...</p>
                    <div className="options-wrapper">
                        <div className="spacer-30" />
                        <button onClick={() => props.history.push("/shoppinglists")}>Back to Shopping Lists</button>
                    </div>
                </div>
            )
        )
    )
}