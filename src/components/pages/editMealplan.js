import React, { useContext, useState } from 'react'

import GenerateMealplanForm from '../forms/generateMealplanForm'

import { UserContext } from '../app'

export default function EditMealplan(props) {
    const { user, setUser } = useContext(UserContext)
    const [mealplan] = useState(user.mealplans.filter(mealplan => mealplan.id === parseInt(props.match.params.id))[0])

    const handleSuccessfulEdit = data => {
        user.mealplans.splice(user.mealplans.findIndex(mealplan => mealplan.id === data.id), 1, data)
        user.shoppinglists.splice(user.shoppinglists.findIndex(shoppinglist => shoppinglist.mealplan_id === data.id), 1, data.shoppinglist)
        setUser({...user})
        props.history.push(`/mealplans/view/${data.id}`)
    }

    return (
        (mealplan 
            ? (
                <div className='page-wrapper edit-mealplan-page-wrapper'>
                    <GenerateMealplanForm mealplan={mealplan} edit handleSuccessfulEdit={handleSuccessfulEdit} />
                    <div className="spacer-40" />
                    <div className="options-wrapper">
                        <button onClick={() => props.history.push(`/mealplans/view/${mealplan.id}`)}>Cancel</button>
                    </div>
                </div>
            )
            : (
                <div className='page-wrapper edit-mealplan-page-wrapper'>
                    <p className="not-found">Sorry, this mealplan does not exist...</p>
                    <div className="spacer-30" />
                    <div className="options-wrapper">
                        <button onClick={() => props.history.push("/mealplans")}>Back to Mealplans</button>
                    </div>
                </div>
            )
        )
    )
}