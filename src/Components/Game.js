import { useCallback, useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import PlayerBoard from "./PlayerBoard"
import { difference, isEqual, join } from "lodash"
import './Game.css'
import GameHeader from "./GameHeader"

const SHIP_NAMES = [
    'carrier',
    'battleship',
    'submarine',
    'destroyer',
    'patrolBoat',
]


export default function Game({backendUrl, appendError}) {
    const {id} = useParams()
    const [joined, setJoined] = useState(false)
    const [token, setToken] = useState(useLocation()?.state?.token)
    const [response, setResponse] = useState()

    useEffect(() => {
        if (joined) {
            return
        }
        const join = async () => {
            const url = new URL(backendUrl)
            url.pathname = `join/${id}`
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
                console.error(response);
                appendError(response)
                return
            } 
            try {
                response = await response.json()
                setResponse(prev => {
                    if (isEqual(prev, response)) {
                        return prev
                    }
                    return response
                })
                setToken(response.token)
                setJoined(true)
            } catch (err) {
                appendError(err)
            }
        }
        join()
    }, [token, id, joined, backendUrl])

    return (
        <>
            {JSON.stringify(response?.token)}
            <button onClick={() => {appendError('test')}}>error</button>
        </>
    )

/*
    return (
        <div className="game">
            <GameHeader id={id} state={state} attackTurn={attackTurn} shipToPlace={shipsToPlace[0]}/>
            <button onClick={() => {setVertical(prev => !prev)}}>Change Orientation</button>
            <div className="boards">
                <PlayerBoard board={board} clickCell={playerClickCell} shipToPlace={shipsToPlace[0]} vertical={vertical}/>
                <PlayerBoard board={enemyBoard} clickCell={enemyClickCell}/> 
            </div>
        </div>
    )
*/
}