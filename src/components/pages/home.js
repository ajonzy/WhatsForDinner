import React, { useContext } from 'react'
import Cookies from 'js-cookie'

import { UserContext } from '../app'

export default function Home(props) {
    const { setUser, logoutUser } = useContext(UserContext)
    return (
        <div className='page-wrapper home-page-wrapper'>
            Home
            <button onClick={logoutUser}>Logout</button>
        </div>
    )
}