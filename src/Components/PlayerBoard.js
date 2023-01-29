import './PlayerBoard.css'

import { isEqual } from 'lodash'

const BOARD_SIZE = 10

export default function PlayerBoard({board, clickCell}) {
    console.log(board);
    if (!board) {
        return <></>
    }

    const {ships, shells} = board

    const shipPositions = []
        Object.values(ships).forEach(ship => {
        ship.positions.forEach(position => shipPositions.push(position))
    })
    
    
    const cells = []
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            cells.push(
                <div
                    key={`${j}${i}`} 
                    onClick={(e) => {clickCell(j, i)}}
                    className={shipPositions.some(position => isEqual(position, {x: j, y:i}))  ?
                    'cell s' :
                    'cell w'}
                >
                </div>)
        }
    }


    return (
        <div className="board">
            {cells}
        </div>    
    )
}