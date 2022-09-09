import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'

import { UserContext } from '../app'

export default function Friends(props) {
    const { user } = useContext(UserContext)
    const [friendsList, setFriendsList] = useState(user.friends)

    const handleFilter = event => {
        setFriendsList(user.friends.filter(friend => (
            friend.username.toLowerCase().includes(event.target.value.toLowerCase())
        )))
    }

    const renderFriends = () => {
        if (user.friends.length === 0) {
            return (
                <div className='no-content'>No friends here yet... Get adding!</div>
            )
        }

        friendsList.reverse()

        const friends = friendsList.map(friend => (
            <div key={`friend-${friend.user_id}`} className="friend-wrapper" onClick={() => props.history.push(`/friends/view/${friend.username}`)}>
                <p className='name'>{friend.username}</p>
            </div>
        ))

        return friends
    }

    return (
        <div className='page-wrapper friends-page-wrapper'>
            <div className="options-wrapper">
                <Link to="/friends/add"><button>Send Friend Request</button></Link>
                <Link to="/friends/requests"><button>View Friend Requests</button></Link>
                <input type="text"
                    placeholder='Search: usernames'
                    onChange={handleFilter}
                />
            </div>
            <div className="friends-wrapper">
                {renderFriends()}
            </div>
        </div>
    )
}