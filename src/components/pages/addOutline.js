import React, { useContext } from 'react'

import GenerateMealplanForm from '../forms/generateMealplanForm'

import { UserContext } from '../app'

export default function AddOutline(props) {
    const { user, setUser } = useContext(UserContext)

    const handleSuccessfulAdd = data => {
        user.mealplanoutlines.push(data)
        setUser({...user})
        props.history.push("/mealplanoutlines")
    }

    return (
        <div className='page-wrapper add-outline-page-wrapper'>
            <GenerateMealplanForm outlineAdd handleBuildMealplan={handleSuccessfulAdd} />
            <div className="options-wrapper">
                <div className="spacer-40" />
                <button onClick={() => props.history.push("/mealplanoutlines")}>Cancel</button>
            </div>
        </div>
    )
}