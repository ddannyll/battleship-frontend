import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import ErrorHandler from "./ErrorHandler";
import Game from "./Game";
import Home from "./Home";

function App() {
    const backendUrl = process.env.REACT_APP_BACKENDURL || 'http://localhost:4200'
    console.log(`Using ${backendUrl} as the backend`);
    const [ sessionToken, setSessionToken ] = useState(window.sessionStorage.getItem('sessionToken'))
    const [ errors, setErrors ] = useState([])

    const appendError = (errorMessage) => {
        const errorIndex = errors.length
        const error = {
            message: errorMessage,
            dismissed: false,
            dismiss: () => {
                console.log(errorIndex);
                setErrors(prev => prev.slice(0, errorIndex)
                    .concat(
                        {
                            message: errorMessage,
                            dismissed: true
                        }   
                    )
                    .concat(prev.slice(errorIndex + 1))
                )
            }
        }
        setErrors(prev => [...prev, error])
    }

    useEffect(() => {
        window.sessionStorage.setItem('sessionToken', sessionToken)
    }, [sessionToken])

    return (
        <>
            <ErrorHandler errors={errors}/>
            <Routes>
                <Route path="/" element={<Home backendUrl={backendUrl} setSessionToken={setSessionToken} appendError={appendError}/>}/>
                <Route path="/game/:id" element={<Game backendUrl={backendUrl} sessionToken={sessionToken} setSessionToken={setSessionToken} appendError={appendError}/>}/>
            </Routes>
        </>
    );
}

export default App;
