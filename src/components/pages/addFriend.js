import React, { useContext } from 'react'

import { UserContext } from '../app'
import FriendForm from '../forms/friendForm'

export default function AddFriend(props) {
    const { user, setUser } = useContext(UserContext)

    const handleSuccessfulRequest = data => {
        user.outgoing_friend_requests.push(data)
        setUser({...user})
        props.history.push("/friends")
    }

    return (
        <div className='page-wrapper add-friend-page-wrapper'>
            <FriendForm handleSuccessfulRequest={handleSuccessfulRequest} />
        </div>
    )
}