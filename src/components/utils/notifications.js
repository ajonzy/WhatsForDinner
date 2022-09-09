import React, { useContext } from 'react'
import { withRouter } from 'react-router'

import { UserContext } from '../app'
import Notification from './notification'

function Notifications(props) {
    const { user } = useContext(UserContext)

    const renderNotifications = () => (
        user.notifications.slice(0, 1).map(notification => <Notification key={`notification-${notification.id}`} {...props} notification={notification} />)
    )

    return (
        <div className='notifications-wrapper'>
            {user.id && user.notifications.length > 0 ? renderNotifications() : null}
        </div>
    )
}

export default withRouter(Notifications)