import './GameHeader.css'

export default function GameHeader({ id, state, attackTurn, shipToPlace, winner }) {
    
    let primaryText = 'Unknown Primary'
    let secondaryText = 'Unknown Secondary'
    if (state === 'place') {
        primaryText = 'Pregame'
        secondaryText = !shipToPlace ? 'Waiting for opponent...' : 'Place your ' + shipToPlace
    } else if (state === 'battle') {
        primaryText = 'Battle'
        secondaryText = attackTurn ? 'Your turn to attack!' : 'Waiting for opponent...'
    } else if (state ==='finish') {
        primaryText = 'Game Over!'
        secondaryText = ''
    }


    return (
        <div className="gameHeader">
            <h1>{primaryText}</h1>
            <h2>{secondaryText}</h2>
        </div>
    )
}