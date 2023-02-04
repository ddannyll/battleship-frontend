import { useCallback, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import 'destyle.css'
import Game from "./Game";
import Home from "./Home";
import './App.css'
import uniqid from 'uniqid';
import ErrorNotifications from "./ErrorNotifications";

function App() {
    const backendUrl = process.env.REACT_APP_BACKENDURL || 'http://localhost:4200'
    const [ errors, setErrors ] = useState([])
    const [ token, setToken ] = useState(window.sessionStorage.getItem('token'))

    
    useEffect(() => {
        console.log(`Using ${backendUrl} as the backend`);
    }, [backendUrl])

    const appendError = useCallback((errorMessage) => {
        const id = uniqid()
        const newError = {
            id,
            message: errorMessage,
            dismissed: false,
            dismiss: () => {setErrors(prev => prev.filter(error => error.id !== id))}
        }
        setErrors(prev => [...prev, newError])
    }, [])

    useEffect(() => {
        console.log('getting token');
        if (token) {
            return
        }
        const controller = new AbortController()
        const getToken = async () => {
            const url = new URL(backendUrl)
            url.pathname = 'token'
            let response = await fetch(url, {
                signal: controller.signal,
                mode:'cors',
                method:'POST',
            })
            if (!response.ok) {
                appendError('Cannot request token from backend server.')
                return
            }
            try {
                response = await response.json()
                setToken(response.token)
                console.log(' t : ' + response.token);
                window.sessionStorage.setItem('token', response.token)
            } catch (err) {
                appendError(err.message)
            }
        }
        getToken()
        return () => {controller.abort()}
    }, [appendError, backendUrl, token])

    return (
        <>
        {token}
            <ErrorNotifications errors={errors}/>
            <Routes>
                <Route path="/" element={<Home backendUrl={backendUrl} appendError={appendError} token={token}/>}/>
                <Route path="/game/:id" element={<Game backendUrl={backendUrl} appendError={appendError} token={token}/>}/>
            </Routes>
        </>
    );
}

export default App;
