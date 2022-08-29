import React, { useContext } from 'react'
import ShoppinglistForm from '../forms/shoppinglistForm'

import { UserContext } from '../app'

export default function AddShoppinglist(props) {
    const { user, setUser } = useContext(UserContext)

    const handleSuccessfulAddShoppinglist = data => {
        user.shoppinglists.push(data)
        setUser({...user})
        props.history.push("/shoppinglists")
    }

    return (
        <div className='page-wrapper add-shoppinglist-wrapper'>
            <ShoppinglistForm handleSuccessfulAddShoppinglist={handleSuccessfulAddShoppinglist} />
        </div>
    )
}