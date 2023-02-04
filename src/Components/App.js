import { useCallback, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import 'destyle.css'
import Game from "./Game";
import Home from "./Home";
import './App.css'
import uniqid from 'uniqid';
import ErrorNotifications from "./ErrorNotifications";

function App() {
    let backendUrl = process.env.REACT_APP_BACKENDURL || 'http://localhost:4200'
    const [ errors, setErrors ] = useState([])
    
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


    return (
        <>
            <ErrorNotifications errors={errors}/>
            <Routes>
                <Route path="/" element={<Home backendUrl={backendUrl} appendError={appendError}/>}/>
                <Route path="/game/:id" element={<Game backendUrl={backendUrl} appendError={appendError}/>}/>
            </Routes>
        </>
    );
}

export default App;
