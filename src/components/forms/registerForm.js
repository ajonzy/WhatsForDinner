import React, { useState } from 'react'

import LoadingError from '../utils/loadingError'

export default function RegisterForm(props) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleRegister = event => {
        event.preventDefault()

        setError("")

        if (password !== passwordConfirm) {
            setError("Password confirmation does not match.")
        }
        else if (username === "" || password === "" || passwordConfirm === "" || email === "") {
            setError("Please fill out all fields.")
        }
        else {
            setLoading(true)

            fetch("https://whatsfordinnerapi.herokuapp.com/user/add", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    username,
                    password,
                    email
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 400) {
                    if (data.message.startsWith("Error")) {
                        setError("An error occured... Please try again later.")
                        console.log(data)
                    }
                    else {
                        setError(data.message)
                    }
                    setLoading(false)
                }
                else if (data.status === 200) {
                    props.handleSuccessfulAuth(data.data)
                }
                else {
                    setError("An error occured... Please try again later.")
                    console.log(data)
                    setLoading(false)
                }
            })
            .catch(error => {
                setError("An error occured... Please try again later.")
                console.log("Error logging in: ", error)
                setLoading(false)
            })
        }
    }

    return (
        <form className='form-wrapper login-form-wrapper'
            onSubmit={handleRegister}
        >
            <h3>Register</h3>
            <input 
                type="text" 
                placeholder='Username'
                value={username}
                onChange={event => setUsername(event.target.value)}
                required
            />
            <input 
                type="password" 
                placeholder='Password'
                value={password}
                onChange={event => setPassword(event.target.value)}
                required
            />
            <input 
                type="password" 
                placeholder='Confirm Password'
                value={passwordConfirm}
                onChange={event => setPasswordConfirm(event.target.value)}
                required
            />
            <input 
                type="email" 
                placeholder='Email'
                value={email}
                onChange={event => setEmail(event.target.value)}
                required
            />
            <button type="submit" disabled={loading}>Register</button>
            <LoadingError loading={loading} error={error} />
        </form>
    )
}