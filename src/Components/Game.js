import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { difference, isEqual } from "lodash"
import './Game.css'
import Board from "./Board"
import GameHeader from "./GameHeader"

const SHIP_NAMES = [
    'carrier',
    'battleship',
    'submarine',
    'destroyer',
    'patrolBoat',
]


export default function Game({backendUrl, appendError, token}) {
    const {id} = useParams()
    const [response, setResponse] = useState()
    const [shipsToPlace, setShipsToPlace] = useState([])
    const [vertical, setVertical] = useState(false)
    
    const handleResponse = useCallback((response) => {
        response.then(response => {
            if (!response.ok) {
                return response.text().then(text=>{throw new Error(text)})
            }
            return response.json()
        })
        .then(response => {
            setResponse(response)
        })
        .catch(err => {
            console.error(err)
            appendError(err)
        })
    }, [appendError] )
    
    const placeShip = useCallback((shipName, x, y, vertical) => {
        const postUrl = new URL(backendUrl)
        postUrl.pathname = `place/${id}`
        handleResponse(
            fetch(postUrl, {
                mode:'cors',
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({
                    token,
                    shipName,
                    position: {
                        x,
                        y
                    },
                    vertical
                })
            })
        )
        console.log('placing ship: ' + shipName);
    }, [backendUrl, token, id, handleResponse])

    const attack = useCallback((x, y) => {
        console.log('attack');
        const postUrl = new URL(backendUrl)
        postUrl.pathname = `attack/${id}`
        handleResponse(
            fetch(postUrl, {
                mode:'cors',
                method:'POST',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify({
                    token,
                    position: {
                        x,
                        y
                    }
                })
            })
        )
    }, [handleResponse, backendUrl, id, token])
    
    
    const playerClickCell = useCallback((x, y) => {
        if (response?.state === 'place' && shipsToPlace.length > 0) {
            placeShip(shipsToPlace[0], x, y, vertical)
        }
        
    }, [response?.state, shipsToPlace, vertical, placeShip])

    const enemyClickCell = useCallback((x, y) => {
        if (response?.state === 'battle' && response?.attackTurn) {
            attack(x, y)
        }
    }, [response?.state, response?.attackTurn, attack])

    
    useEffect(() => {
        if (!token) {
            return
        }
        const controller = new AbortController()
        const url = new URL(backendUrl)
        url.pathname = `join/${id}`
        handleResponse(
            fetch(url, {
                mode:'cors',
                signal: controller.signal,
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({
                    token,
                })
            })
        )
        return () => {controller.abort()}
    }, [id, backendUrl, token, appendError, handleResponse])


    useEffect(() => {
        // useEffect for settings ShipsToPlace
        if (!response) {
            return
        }
        console.log(response);
        setShipsToPlace((prevShips) => {
            const newShips = difference(SHIP_NAMES, Object.keys(response.board.ships))
            if (isEqual(newShips, prevShips)) {
                return prevShips
            }
            return newShips
        })
    }, [response])

    useEffect(() => {
        console.log('fetch effect');
        const fetchResponse = async () => {
            console.log('fetching');
            const url = new URL(backendUrl)
            url.pathname = `response/${id}`
            url.searchParams.set('token', token)
            let response = await fetch(url, {
                mode: 'cors',
                method: 'GET'
            })
            response = await response.json()
            setResponse(prev => {
                if (isEqual(prev, response)) {
                    return prev
                }
                return response
            })
        }
        fetchResponse()
        let intervalId
        if (response && ((!response.attackTurn && response.state === 'battle') || (shipsToPlace.length === 0 && response.state === 'place'))) {
            console.log('interval');
            intervalId = setInterval(fetchResponse, 1000)
        }
        return (() => clearInterval(intervalId))
    }, [shipsToPlace, response, backendUrl, id, token])


    return (
        <>
            <GameHeader id={id} state={response?.state} attackTurn={response?.attackTurn} shipToPlace={shipsToPlace[0]}/>
            {JSON.stringify(response?.token)}
            <button onClick={() => {appendError('test')}}>error</button>
            <button onClick={() => {setVertical(prev => !prev)}}>Change Orientation</button>
            <div className="boards">
                <Board board={response?.board} clickCell={playerClickCell} shipToPlace={shipsToPlace[0]} vertical={vertical}/>
                <Board board={response?.enemyBoard} clickCell={enemyClickCell}/>
            </div>
        </>
    )

/*
    return (
        <div className="game">
            <button onClick={() => {setVertical(prev => !prev)}}>Change Orientation</button>
            <div className="boards">
                <PlayerBoard board={board} clickCell={playerClickCell} shipToPlace={shipsToPlace[0]} vertical={vertical}/>
                <PlayerBoard board={enemyBoard} clickCell={enemyClickCell}/> 
            </div>
        </div>
    )
*/
}