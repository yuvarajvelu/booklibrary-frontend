import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const Notify = ({ errorMessage }) => {
    if ( !errorMessage ) {
      return null
    }
  
    return (
      <div style={{color: 'red'}}>
        {errorMessage}
      </div>
    )
}

const LoginForm = ({ show, setToken }) => {
    const [ username, setUsername ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ errorMsg, setErrorMsg] = useState(null)

    const notify = (message) => {
        setErrorMsg(message)
        setTimeout(() => {
          setErrorMsg(null)
        },5000)
      }

    const [ login, result ] = useMutation(LOGIN, {
        onError: (error) => notify(error.graphQLErrors[0].message)
    })

    useEffect(() => {
        if(result.data) {
            const token = result.data.login.value
            setToken(token)
            localStorage.setItem('libraryapp-user', token)
        }   
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [result.data])

    const handleLogin = () => {
        login({ variables: { username, password }})
        setUsername('')
        setPassword('')
    }
    if(!show) {
        return null
    }
    return(
        <form onSubmit = {handleLogin}>
            <Notify errorMessage = {errorMsg} />
            <div>
                username <input type = 'text' value = {username} onChange = {({target}) => setUsername(target.value)} />
            </div>
            <div>
                password <input type = 'password' value = {password} onChange = {({target}) => setPassword(target.value)} />
            </div>
            <button type = 'submit'>Login</button>
        </form>
    )
}

export default LoginForm