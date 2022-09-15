import React, { useContext, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare, faSquareCheck } from '@fortawesome/free-regular-svg-icons'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import LoadingError from '../utils/loadingError'

import titleize from '../../functions/titleize'

import { UserContext } from '../app'

export default function GenerateMealplanForm(props) {
    const { user } = useContext(UserContext)
    const [outline, setOutline] = useState("")
    const [name, setName] = useState(props.edit ? props.mealplan.name : props.data ? props.data.name || "" : "")
    const [number, setNumber] = useState(props.data ? props.data.number || "" : "")
    const [rules, setRules] = useState(props.data ? props.data.rules.map(rule => ({...rule, type: rule.rule_type})) || [] : [])
    const [saveOutline, setSaveOutline] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleGenerate = event => {
        event.preventDefault()

        setError("")
        setLoading(true)

        if (name === "") {
            setError("Please fill out all required fields.")
            setLoading(false)
        }
        else if (saveOutline && user.mealplanoutlines.map(mealplanoutline => mealplanoutline.name).includes(titleize(name))) {
            setError("Sorry, each saved mealplan outline can not have the same name as a previously saved mealplan outline.")
            setLoading(false)
        }
        else {
            props.handleBuildMealplan(titleize(name), number, rules, saveOutline)
        }
    }

    const handleEdit = event => {
        event.preventDefault()

        setError("")

        if (name === "") {
            setError("Please fill out all required fields.")
        }
        else if (name !== props.mealplan.name) {
            setLoading(true)

            fetch(`https://whatsforsupperapi.herokuapp.com/mealplan/update/${props.mealplan.id}`, {
                method: "PUT",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    name: titleize(name)
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 400) {
                    setError("An error occured... Please try again later.")
                    console.log(data)
                    setLoading(false)
                }
                else if (data.status === 200) {
                    props.handleSuccessfulEdit(data.data)
                }
                else {
                    setError("An error occured... Please try again later.")
                    console.log(data)
                    setLoading(false)
                }
            })
            .catch(error => {
                setError("An error occured... Please try again later.")
                console.log("Error updating mealplan: ", error)
                setLoading(false)
            })
        }
    }

    const handleOutlineEdit = async event => {
        event.preventDefault()

        setError("")

        if (name === "") {
            setError("Please fill out all required fields.")
            setLoading(false)
        }
        else if (name !== props.data.name && user.mealplanoutlines.map(mealplanoutline => mealplanoutline.name).includes(titleize(name))) {
            setError("Sorry, each saved mealplan outline can not have the same name as a previously saved mealplan outline.")
            setLoading(false)
        }
        else {
            setLoading(true)
            let newData = {...props.data}

            const data = await fetch(`https://whatsforsupperapi.herokuapp.com/mealplanoutline/update/${props.data.id}`, {
                method: "PUT",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    name: titleize(name),
                    number
                })
            })
            .then(response => response.json())
            .catch(error => {
                return { catchError: error }
            })  
            if (data.status === 400) {
                setError("An error occured... Please try again later.")
                console.log(data)
                setLoading(false)
                return false
            }
            else if (data.catchError) {
                setError("An error occured... Please try again later.")
                setLoading(false)
                console.log("Error updating mealplan outline: ", data.catchError)
                return false
            }
            else if (data.status === 200) {
                newData = data.data
            }
            else {
                setError("An error occured... Please try again later.")
                console.log(data)
                setLoading(false)
                return false
            }

            const newRules = rules.filter(rule => rule.id === undefined)
            const updatedRules = rules.filter(rule => rule.id !== undefined).filter(rule => {
                const originalRule = newData.rules.filter(newDataRule => newDataRule.id === rule.id)[0]
                console.log(originalRule)
                console.log(rule.type, originalRule.rule_type)
                if (
                    rule.type !== originalRule.rule_type ||
                    rule.rule !== originalRule.rule ||
                    rule.amount !== originalRule.amount ||
                    titleize(rule.value) !== originalRule.value 
                ) {
                    return rule
                }
            })
            const deletedRules = newData.rules.filter(existingRule => !rules.map(rule => rule.id).includes(existingRule.id))
            if (newRules.length > 0) {
                for (let rule of newRules) {
                    const data = await fetch("https://whatsforsupperapi.herokuapp.com/rule/add", {
                        method: "POST",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({
                            rule_type: rule.type,
                            rule: rule.rule,
                            amount: rule.amount,
                            value: titleize(rule.value),
                            mealplanoutline_id: newData.id
                        })
                    })
                    .then(response => response.json())
                    .catch(error => {
                        return { catchError: error }
                    }) 
                     
                    if (data.status === 400) {
                        setError("An error occured... Please try again later.")
                        console.log(data)
                        setLoading(false)
                        return false
                    }
                    else if (data.catchError) {
                        setError("An error occured... Please try again later.")
                        setLoading(false)
                        console.log("Error adding rule: ", data.catchError)
                        return false
                    }
                    else if (data.status === 200) {
                        newData.rules.push(data.data)
                    }
                    else {
                        setError("An error occured... Please try again later.")
                        console.log(data)
                        setLoading(false)
                        return false
                    }
                }
            }

            if (updatedRules.length > 0) {
                for (let rule of updatedRules) {
                    console.log(rule)
                    const data = await fetch(`https://whatsforsupperapi.herokuapp.com/rule/update/${rule.id}`, {
                        method: "PUT",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({
                            rule_type: rule.type,
                            rule: rule.rule,
                            amount: rule.amount,
                            value: titleize(rule.value)
                        })
                    })
                    .then(response => response.json())
                    .catch(error => {
                        return { catchError: error }
                    }) 
                     console.log(data)
                    if (data.status === 400) {
                        setError("An error occured... Please try again later.")
                        console.log(data)
                        setLoading(false)
                        return false
                    }
                    else if (data.catchError) {
                        setError("An error occured... Please try again later.")
                        setLoading(false)
                        console.log("Error adding rule: ", data.catchError)
                        return false
                    }
                    else if (data.status === 200) {
                        newData.rules.splice(newData.rules.findIndex(rule => rule.id === data.data.id), 1, data.data)
                    }
                    else {
                        setError("An error occured... Please try again later.")
                        console.log(data)
                        setLoading(false)
                        return false
                    }
                }
            }

            if (deletedRules.length > 0) {
                for (let rule of deletedRules) {
                    const data = await fetch(`https://whatsforsupperapi.herokuapp.com/rule/delete/${rule.id}`, { method: "DELETE" })
                    .then(response => response.json())
                    .catch(error => {
                        return { catchError: error }
                    })  
                    if (data.catchError) {
                        setError("An error occured... Please try again later.")
                        setLoading(false)
                        console.log("Error deleting rule: ", data.catchError)
                        return false
                    }
                    else if (data.status === 200) {
                        newData.rules.splice(newData.rules.findIndex(rule => rule.id === data.data.id), 1)
                    }
                    else {
                        setError("An error occured... Please try again later.")
                        console.log(data)
                        setLoading(false)
                        return false
                    }
                }
            }

            props.handleSuccessfulEdit(newData)
        }
    }

    const handleMealplanoutlineSelect = mealplanoutline => {
        if (mealplanoutline === "") {
            setName("")
            setNumber("")
            setRules([])
        }
        else {
            mealplanoutline = user.mealplanoutlines.filter(outline => outline.name === mealplanoutline)[0]
            setName(mealplanoutline.name)
            setNumber(mealplanoutline.number)
            setRules(mealplanoutline.rules.map(rule => ({...rule, type: rule.rule_type})))
        }
    }

    return (
        <form className='form-wrapper generate-mealplan-form-wrapper'
            onSubmit={props.edit ? handleEdit : props.outlineEdit ? handleOutlineEdit : handleGenerate}
        >
            <h3>{props.edit ? `Edit ${props.mealplan.name}` : props.outlineEdit ? `Edit ${props.data.name} Outline` : "Create a Mealplan"}</h3>
            {user.mealplanoutlines.length > 0 && !props.outlineEdit ? <label>Mealplan Outline</label> : null}
            {user.mealplanoutlines.length > 0 && !props.outlineEdit
                ? (
                    <select 
                        value={outline}
                        onChange={event => {
                            handleMealplanoutlineSelect(event.target.value)
                            setOutline(event.target.value)
                        }}
                    >
                        <option value="">None</option>
                        {user.mealplanoutlines.map(mealplanoutline => (
                            <option key={`mealplanoutline-${mealplanoutline.id}`} value={mealplanoutline.name}>{mealplanoutline.name}</option>
                        ))}
                    </select>
                ) 
                : null
            }
            <label>Name</label>
            <input type="text"
                value = {name}
                placeholder = "Mealplan Name"
                onChange={event => {
                    setName(event.target.value)
                    setOutline("")
                }}
                required
            />
            {props.edit ? null : <label>Number of Meals</label>}
            {props.edit
                ? null
                : (
                    <input type="number" 
                        value={number}
                        placeholder="Amount"
                        onChange={event => {
                            setNumber(isNaN(event.target.valueAsNumber) ? "" : event.target.valueAsNumber)
                            setOutline("")
                        }}
                        min="1"
                        required
                    />
                )
            }
            {props.edit ? null : <label>Rules</label>}
            {props.edit
                ? null
                : (
                    <div className="rules-wrapper">
                        {rules.map((rule, index) => (
                            <div className="rule-wrapper" key={`rule-${index}`}>
                                <button type='button' className='icon-button' onClick={() => {
                                    rules.splice(index, 1)
                                    setRules([...rules])
                                    setOutline("")
                                }}><FontAwesomeIcon icon={faTimesCircle} /></button>
                                <select 
                                    value={rule.type}
                                    onChange={event => {
                                        rule.type = event.target.value
                                        setRules([...rules])
                                        setOutline("")
                                    }}
                                >
                                    <option value="Category">Category</option>
                                    <option value="Name">Name</option>
                                    <option value="Difficulty">Difficulty</option>
                                </select>
                                <select 
                                    value={rule.rule}
                                    onChange={event => {
                                        rule.rule = event.target.value
                                        setRules([...rules])
                                        setOutline("")
                                    }}
                                >
                                    <option value="At least">At least</option>
                                    <option value="No more than">No more than</option>
                                    <option value="Exactly">Exactly</option>
                                    <option value="None">None</option>
                                </select>
                                {rule.rule === "None"
                                    ? null
                                    : (
                                        <input type="number" 
                                            value={rule.amount}
                                            placeholder="Amount"
                                            onChange={event => {
                                                rule.amount = isNaN(event.target.valueAsNumber) ? "" : event.target.valueAsNumber
                                                setRules([...rules])
                                                setOutline("")
                                            }}
                                            min="1"
                                            required
                                        />
                                    )
                                }
                                <input type="text" 
                                    value={rule.value}
                                    placeholder="Value"
                                    onChange={event => {
                                        rule.value = event.target.value
                                        setRules([...rules])
                                        setOutline("")
                                    }}
                                    required
                                />
                            </div>
                        ))}
                        <button type='button' className='alt-button' onClick={() => {
                            rules.push({
                                type: "Category",
                                rule: "At least",
                                amount: "",
                                value: ""
                            })
                            setRules([...rules])
                            setOutline("")
                        }}>Add Rule</button>
                        {outline === "" && !props.outlineEdit ? <div className="spacer-30" /> : null}
                        {outline === "" && !props.outlineEdit
                            ? (
                                <label className='checkbox'>
                                    Save Mealplan Outline
                                    <input type="checkbox" 
                                        checked={saveOutline}
                                        onChange={event => setSaveOutline(event.target.checked)} 
                                    />
                                    <span>{saveOutline ? <FontAwesomeIcon icon={faSquareCheck} /> : <FontAwesomeIcon icon={faSquare} />}</span>
                                </label>
                            )
                            : null
                        }
                    </div>
                )
            }
            <div className="spacer-40" />
            <button type='submit' disabled={loading}>{props.edit ? "Edit Mealplan" : props.outlineEdit ? "Edit Mealplan Outline" : "Generate Mealplan"}</button>
            <LoadingError loading={loading} error={error} />
        </form>
    )
}