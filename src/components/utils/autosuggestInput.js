import React, { useState } from 'react'
import Autosuggest from 'react-autosuggest';

export default function AutosuggestInput(props) {
    const [inputSuggestions, setInputSuggestions] = useState(props.suggestions)

    const getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length
        const suggestions = props.suggestions.map(suggestion => suggestion.toLowerCase())

        return inputLength === 0 
            ? props.suggestions 
            : !suggestions.includes(inputValue) 
                ? props.suggestions.filter(suggestion => suggestion.toLowerCase().includes(inputValue)) 
                : []
    }

    return (
        <Autosuggest
            suggestions={inputSuggestions}
            onSuggestionsFetchRequested={({ value }) => setInputSuggestions(getSuggestions(value))}
            onSuggestionsClearRequested={() => setInputSuggestions([])}
            getSuggestionValue={suggestion => suggestion}
            renderSuggestion={suggestion => <div className='autosuggest-suggestion'>{suggestion}</div>}
            shouldRenderSuggestions={() => true}
            alwaysRenderSuggestions={false}
            inputProps={{
                placeholder: props.placeholder,
                autoCorrect: "off", 
                value: props.input,
                onFocus: () => getSuggestions(""),
                onChange: (event, { newValue }) => props.setInput(newValue),
                style: props.style ? props.style : {},
                required: props.required || false
            }}
        />
    )
}