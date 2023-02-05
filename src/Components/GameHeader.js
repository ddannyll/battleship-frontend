import './GameHeader.css'
import logo from '../images/battleship.png'
import { Link } from 'react-router-dom'
import { startCase } from 'lodash'

export default function GameHeader({ id, state, attackTurn, shipToPlace, winner }) {
    
    let primaryText = ''
    let secondaryText = ''
    if (state === 'place') {
        primaryText = 'Pregame'
        secondaryText = !shipToPlace ? 'Waiting for opponent...' : 'Place your ' + startCase(shipToPlace)
    } else if (state === 'battle') {
        primaryText = 'Battle'
        secondaryText = attackTurn ? 'Your turn to attack!' : 'Waiting for opponent...'
    } else if (state ==='finish') {
        primaryText = 'Game Over!'
        secondaryText = winner ? 'You won!' : 'You lost.'
    }


    return (
        <div className="gameHeader">
            <Link to='/' className='logo'>
                <img src={logo}/>
                <h1>Battleship</h1>
            </Link>
            <div className="stateHeader">
                <h2>{primaryText}</h2>
                <h3 className={attackTurn ? 'critical' : ''}>{secondaryText}</h3>
            </div>
        </div>
    )
}