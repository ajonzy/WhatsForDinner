import React, { useContext, useState } from 'react'

import GenerateMealplanForm from '../forms/generateMealplanForm'
import MealplanForm from '../forms/mealplanForm'

import { UserContext } from '../app'

export default function EditMeals(props) {
    const { user, setUser } = useContext(UserContext)
    const [mealplan] = useState(user.mealplans.filter(mealplan => mealplan.id === parseInt(props.match.params.id))[0])
    const [section, setSection] = useState("mealplan-view")
    const [recheckRules, setRecheckRules] = useState(false)

    const handleSuccessfulEdit = data => {
        user.mealplans.splice(user.mealplans.findIndex(mealplan => mealplan.id === data.id), 1, data)
        user.shoppinglists.splice(user.shoppinglists.findIndex(shoppinglist => shoppinglist.mealplan_id === data.id), 1, data.shoppinglist)
        setUser({...user})
        props.history.push(`/mealplans/view/${data.id}`)
    }

    const handleRulesChange = rules => {
        mealplan.rules = rules
        setUser({...user})
        setRecheckRules(true)
        setSection("mealplan-view")
    }

    const handleCancel = () => {
        if (section === "mealplan-view") {
            props.history.push(`/mealplans/view/${mealplan.id}`)
        }
        else {
            setSection("mealplan-view")
        }
    }

    const renderSection = () => {
        switch(section) {
            case "mealplan-form": return <GenerateMealplanForm data={mealplan} editRules handleRulesChange={handleRulesChange} />
            case "mealplan-view": return <MealplanForm meals={mealplan.meals} data={mealplan} recheckRules={recheckRules} edit setSection={setSection} handleSuccessfulEdit={handleSuccessfulEdit} />
        }
    }

    return (
        (mealplan 
            ? (
                <div className='page-wrapper edit-meals-page-wrapper'>
                    {renderSection()}
                    <div className="options-wrapper">
                        <div className="spacer-40" />
                        <button onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            )
            : (
                <div className='page-wrapper edit-meals-page-wrapper'>
                    <p className="not-found">Sorry, this mealplan does not exist...</p>
                    <div className="options-wrapper">
                        <div className="spacer-30" />
                        <button onClick={() => props.history.push("/mealplans")}>Back to Mealplans</button>
                    </div>
                </div>
            )
        )
    )
}