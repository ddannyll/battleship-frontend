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
        // Wrapper for fetch api, handles errors and sets response state
        response.then(response => {
            if (!response.ok) {
                return response.text().then(text=>{throw new Error(text)})
            }
            return response.json()
        })
        .then(response => {
            setResponse((prev) => {
                if (isEqual(prev, response)) {
                    return prev
                }
                return response
            })
        })
        .catch(err => {
            console.error(err)
            appendError(err.message)
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
        // useEffect to handle joining a battle
        if (!token) {
            return
        }
        console.log('joining');
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
        if (!response || !token) {
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
        // Polling fetch when waiting for enemy turn
        if (!response || !token) {
            return
        }
        console.log('fetch effect');
        const fetchResponse = () => {
            console.log('fetching');
            const url = new URL(backendUrl)
            url.pathname = `response/${id}`
            url.searchParams.set('token', token)
            handleResponse(
                fetch(url, {
                    mode: 'cors',
                    method: 'GET'
                })
            )
        }
        let intervalId
        if (response && ((!response.attackTurn && response.state === 'battle') || (shipsToPlace.length === 0 && response.state === 'place'))) {
            console.log('interval');
            intervalId = setInterval(fetchResponse, 1000)
        }
        return (() => clearInterval(intervalId))
    }, [shipsToPlace, response, backendUrl, id, token, handleResponse])

    
    const changeOrientation = useCallback(() => {
        setVertical(prev => !prev)
    }, [])
    
    const handleSwitchOrientation = useCallback((e) => {
        e.preventDefault()
        changeOrientation()
    }, [changeOrientation])


    const copyGameLink = (e) => {
        const defaultText = 'Copy Game Link'
        navigator.clipboard.writeText(document.URL)
        e.target.innerText = 'Copied to Clipboard'
        setTimeout(() => {
            e.target.innerText = defaultText
        }, 3000)
    }

    return (
        <div className="game">
            <GameHeader id={id} state={response?.state} attackTurn={response?.attackTurn} shipToPlace={shipsToPlace[0]} winner={response?.winner}/>
            <button onClick={changeOrientation}>RMB : Change Orientation</button>
            <div className="boards" onContextMenu={handleSwitchOrientation}>
                <Board board={response?.board} clickCell={playerClickCell} shipToPlace={shipsToPlace[0]} vertical={vertical} />
                <Board board={response?.enemyBoard} clickCell={enemyClickCell}/>
            </div>
            <button className="copyLink" onClick={copyGameLink}>Copy Game Link</button>
        </div>
    )
}