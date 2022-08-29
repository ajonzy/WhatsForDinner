import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import LoadingError from '../utils/loadingError'

export default function GenerateMealplanForm(props) {
    const [name, setName] = useState("Weekly")
    const [number, setNumber] = useState(3)
    const [rules, setRules] = useState([])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = event => {
        event.preventDefault()

        setError("")
        setLoading(true)

        if (name === "") {
            setError("Please fill out all required fields.")
            setLoading(false)
        }

        props.handleBuildMealplan(name, number, rules)
    }

    return (
        <form className='form-wrapper generate-mealplan-form-wrapper'
            onSubmit={handleSubmit}
        >
            <h3>Create a Mealplan</h3>
            <input type="text"
                value = {name}
                placeholder = "Mealplan Name"
                onChange={event => setName(event.target.value)}
                required
            />
            <label>Number of Meals</label>
            <input type="number" 
                value={number}
                placeholder="Amount"
                onChange={event => setNumber(event.target.valueAsNumber)}
                min="1"
                required
            />
            <label>Rules</label>
            <div className="rules-wrapper">
                {rules.map((rule, index) => (
                    <div className="rule-wrapper" key={`rule-${index}`}>
                        <button type='button' className='icon-button' onClick={() => {
                            rules.splice(index, 1)
                            setRules([...rules])
                        }}><FontAwesomeIcon icon={faTimesCircle} /></button>
                        <select 
                            value={rule.type}
                            onChange={event => {
                                rule.type = event.target.value
                                setRules([...rules])
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
                                        rule.amount = event.target.valueAsNumber
                                        setRules([...rules])
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
                            }}
                            required
                        />
                    </div>
                ))}
                <button type='button' className='alt-button' onClick={() => {
                    rules.push({
                        type: "Category",
                        rule: "At least",
                        amount: 1,
                        value: ""
                    })
                    setRules([...rules])
                }}>Add Rule</button>
            </div>
            <div className="spacer-40" />
            <button type='submit' disabled={loading}>Generate Mealplan</button>
            <LoadingError loading={loading} error={error} />
        </form>
    )
}