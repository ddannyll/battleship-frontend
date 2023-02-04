import './PlayerBoard.css'

import { isEqual } from 'lodash'
import { useMemo, useState } from 'react'

const BOARD_SIZE = 10
const SHIP_LENGTHS = {
    carrier: 5, 
    battleship: 4,
    destroyer: 3,
    submarine: 3,
    patrolBoat: 2
}

export default function PlayerBoard({board, clickCell, shipToPlace, vertical}) {
    const [ hoverCell, setHoverCell ] = useState(null)
    const highlightCells = useMemo(() => {
        const cells = []
        if (!hoverCell) {
            return cells
        }
        const length = SHIP_LENGTHS[shipToPlace]
        if (!vertical) {
            for (let i = hoverCell.x; i < hoverCell.x + length; i++) {
                cells.push({x: i, y: hoverCell.y})
            }
        } else {
            for (let i = hoverCell.y; i < hoverCell.y + length; i++) {
                cells.push({x: hoverCell.x, y: i})
            }
        }
        return cells
    }, [hoverCell, vertical, shipToPlace])

    if (!board) {
        return <></>
    }

    const {ships, shells} = board

    const shipPositions = []
    
    if (ships !== undefined) {
        // ships will be undefined if enemyboard is used
        Object.values(ships).forEach(ship => {
            ship.positions.forEach(position => shipPositions.push(position))
        })
    }

    
    let cells = []
    for (let i = 0; i < BOARD_SIZE; i++) {
        const row = []
        cells.push(row)
        for (let j = 0; j < BOARD_SIZE; j++) {
            const hasShip = shipPositions.some(position => isEqual(position, {x: j, y:i}))
            const hasShell = shells.some(shell => shell.x === j && shell.y === i)
            const isHit = shells.some(shell => shell.x === j && shell.y === i && shell.hitShip)
            const hasHighlight =  highlightCells.some(cell => cell.x === j && cell.y === i)
            let className = 'cell'
            if (hasShip) {
                className += ' ship'
            }
            if (hasShell) {
                className += ' shell'
            }
            if (isHit) {
                className += ' hit'
            }
            if (hasHighlight) {
                className += ' placeHighlight'
            }
            
            row.push(
                <div
                    key={`${j} ${i}`} 
                    onClick={(e) => {clickCell(j, i)}}
                    onMouseOver={() => {setHoverCell({x:j, y:i})}}
                    onMouseOut={() => {setHoverCell(null)}}
                    className={className}
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