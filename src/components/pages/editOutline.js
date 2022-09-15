import React, { useContext, useState } from 'react'
import GenerateMealplanForm from '../forms/generateMealplanForm'

import { UserContext } from '../app'

export default function EditOutline(props) {
    const { user, setUser } = useContext(UserContext)
    const [outline] = useState(user.mealplanoutlines.filter(outline => outline.id === parseInt(props.match.params.id))[0])

    const handleSuccessfulEdit = data => {
        user.mealplanoutlines.splice(user.mealplanoutlines.findIndex(mealplanoutline => mealplanoutline.id === data.id), 1, data)
        setUser({...user})
        props.history.push("/mealplanoutlines")
    }

    return (
        (outline 
            ? (
                <div className='page-wrapper edit-outline-page-wrapper'>
                    <GenerateMealplanForm data={outline} outlineEdit handleSuccessfulEdit={handleSuccessfulEdit} />
                </div>
            )
            : (
                <div className='page-wrapper edit-outline-page-wrapper'>
                    <p className="not-found">Sorry, this outline does not exist...</p>
                    <div className="spacer-30" />
                    <div className="options-wrapper">
                        <button onClick={() => props.history.push("/mealplanoutlines")}>Back to Mealplan Outlines</button>
                    </div>
                </div>
            )
        )
    )
}