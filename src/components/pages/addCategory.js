import React, { useContext } from 'react'

import CategoryForm from '../forms/categoryForm'

import { UserContext } from '../app'

export default function AddCategory(props) {
    const { user, setUser } = useContext(UserContext)

    const handleSuccessfulAdd = data => {
        user.categories.push(data)
        setUser({...user})
        props.history.push("/mealcategories")
    }

    return (
        <div className='page-wrapper add-category-page-wrapper'>
            <CategoryForm handleSuccessfulAdd={handleSuccessfulAdd} />
            <div className="spacer-40" />
            <div className="options-wrapper">
                <button onClick={() => props.history.push("/mealcategories")}>Cancel</button>
            </div>
        </div>
    )
}