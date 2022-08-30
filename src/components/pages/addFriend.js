import React, { useContext } from 'react'

import { UserContext } from '../app'
import FriendForm from '../forms/friendForm'

export default function AddFriend(props) {
    const { user, setUser } = useContext(UserContext)

    const handleSuccessfulRequest = data => {
        setUser(data.user)
        props.history.push("/friends/requests")
    }

    return (
        <div className='page-wrapper add-friend-page-wrapper'>
            <FriendForm handleSuccessfulRequest={handleSuccessfulRequest} />
            <div className="spacer-40" />
            <button onClick={() => props.history.push("/friends")}>Back to Friends List</button>
        </div>
    )
}