import { Routes, Route } from "react-router-dom";
import Game from "./Game";
import Home from "./Home";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/game/:id" element={<Game backendUrl='https://battleship-production.up.railway.app/'/>}/>
        </Routes>
    );
}

export default App;
