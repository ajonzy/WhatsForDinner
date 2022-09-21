import React, { useContext, useState } from 'react'

import ShoppinglistForm from '../forms/shoppinglistForm'

import { UserContext } from '../app'

export default function EditShoppinglist(props) {
    const { user, setUser } = useContext(UserContext)
    const [shoppinglist] = useState(user.shoppinglists.filter(shoppinglist => shoppinglist.id === parseInt(props.match.params.id))[0])

    const handleSuccessfulSubmit = data => {
        user.shoppinglists.splice(user.shoppinglists.findIndex(shoppinglist => shoppinglist.id === data.id), 1, data)
        setUser({...user})
        props.history.push(`/shoppinglists/view/${data.id}`)
    }

    return (
        (shoppinglist && !shoppinglist.is_sublist
            ? (
                <div className='page-wrapper edit-shoppinglist-page-wrapper'>
                    <ShoppinglistForm shoppinglist={shoppinglist} edit editShoppinglist handleSuccessfulSubmit={handleSuccessfulSubmit} />
                    <div className="spacer-40" />
                    <div className="options-wrapper">
                        <button onClick={() => props.history.push(`/shoppinglists/view/${shoppinglist.id}`)}>Cancel</button>
                    </div>
                </div>
            )
            : (
                <div className='page-wrapper edit-shoppinglist-page-wrapper'>
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