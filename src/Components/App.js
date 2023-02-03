import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Game from "./Game";
import Home from "./Home";

function App() {
    const backendUrl = process.env.REACT_APP_BACKENDURL || 'http://localhost:4200'
    console.log(backendUrl);
    const [ sessionToken, setSessionToken ] = useState(window.sessionStorage.getItem('sessionToken'))
    useEffect(() => {
        window.sessionStorage.setItem('sessionToken', sessionToken)
    }, [sessionToken])

    return (
        <Routes>
            <Route path="/" element={<Home backendUrl={backendUrl} setSessionToken={setSessionToken}/>}/>
            <Route path="/game/:id" element={<Game backendUrl={backendUrl} sessionToken={sessionToken} setSessionToken={setSessionToken}/>}/>
        </Routes>
    );
}

export default App;
