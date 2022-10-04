import React, { useContext, useState } from 'react'
import Cookies from 'js-cookie'

import { UserContext } from '../app'
import LoginForm from '../forms/loginForm'
import RegisterForm from '../forms/registerForm'

import sockets from '../../functions/sockets'

export default function Auth(props) {
    const [form, setForm] = useState(props.location.search === "?register" ? "register" : "login")
    const { getUser, setUser, setSocket } = useContext(UserContext)

    const handleSuccessfulAuth = data => {
        setSocket(sockets(getUser, setUser))
        setUser(data.user)
        Cookies.set("token", data.token)
        props.history.push("/")
    }

    const renderform = () => {
        switch(form) {
            case "login": return <LoginForm handleSuccessfulAuth={handleSuccessfulAuth} />
            case "register": return <RegisterForm handleSuccessfulAuth={handleSuccessfulAuth} />
        }
    }

    return (
        <div className='page-wrapper auth-page-wrapper'>
            <div className="auth-buttons-wrapper">
                <div className={`auth-button auth-button-1 ${form === 'login' ? 'active' : 'inactive'}`}
                    onClick={() => setForm("login")}
                >Login</div>
                <div className={`auth-button auth-button-2 ${form === 'register' ? 'active' : 'inactive'}`}
                    onClick={() => setForm("register")}
                >Register</div>
            </div>
            {renderform()}
        </div>
    )
}