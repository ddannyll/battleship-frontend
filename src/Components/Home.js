import { useNavigate } from "react-router-dom"
import logo from '../images/battleship.png'
import { Link } from "react-router-dom"
import './Home.css'

export default function Home({backendUrl, appendError, token}) {
    const navigate = useNavigate()

    const createGame = async () => {
        const url = new URL(backendUrl)
        url.pathname = 'create'
        try {
            let response = await fetch(url, {
                mode:'cors',
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({
                    token
                })
            })
            if (!response.ok) {
                response = await response.text()
                throw new Error(response)
            }
            response = await response.json()
            const { gameId } = response
            navigate(`/game/${gameId}`)
        } catch (err) {
            console.error(err);
            appendError(err.message)
        }
    }
    
    return (
        <div className="home">
            <div className="gameHeader">
                <Link to='/' className='logo'>
                    <img src={logo} alt="battleship logo"/>
                    <h1>Battleship</h1>
                </Link>
                <button className="clickButton" onClick={createGame}>Create Game</button>
            </div>
        </div>
    )
}