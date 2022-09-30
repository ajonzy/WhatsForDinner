import React, { useContext, useState } from 'react'

import ShareItemForm from '../forms/shareItemForm'

import { UserContext } from '../app'

import titleize from '../../functions/titleize'

export default function ShareItem(props) {
    const { user } = useContext(UserContext)
    const [itemType] = useState(props.match.params.type)
    const [itemId] = useState(parseInt(props.match.params.id))
    const [item] = useState(user[`${itemType}s`].filter(item => item.id === itemId)[0])

    const handleSuccessfulShare = data => {
        props.history.push(`/${itemType}s/view/${itemId}`)
    }

    return (
        (item 
            ? (
                <div className='page-wrapper share-item-page-wrapper'>
                    <ShareItemForm itemType={itemType} itemId={itemId} item={item} handleSuccessfulShare={handleSuccessfulShare} />
                    <div className="options-wrapper">
                        <div className="spacer-40" />
                        <button onClick={() => props.history.push(`/${itemType}s/view/${itemId}`)}>Back to {titleize(itemType === "shoppinglist" ? "shopping list" : itemType)}</button>
                    </div>
                </div>
            )
            : (
                <div className='page-wrapper share-item-page-wrapper'>
                    <p className="not-found">Sorry, this {itemType} does not exist...</p>
                    <div className="options-wrapper">
                        <div className="spacer-30" />
                        <button onClick={() => props.history.push(`/${itemType}s`)}>Back to {titleize(itemType === "shoppinglist" ? "shopping list" : itemType)}s</button>
                    </div>
                </div>
            )
        )
    )
}