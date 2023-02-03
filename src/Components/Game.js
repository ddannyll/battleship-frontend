import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import PlayerBoard from "./PlayerBoard"
import { difference, isEqual } from "lodash"
import './Game.css'
import GameHeader from "./GameHeader"

const SHIP_NAMES = [
    'carrier',
    'battleship',
    'submarine',
    'destroyer',
    'patrolBoat',
]


export default function Game(props) {
    const { id } = useParams()
    const { backendUrl, sessionToken, setSessionToken } = props
    const [ board, setBoard ] = useState()
    const [ enemyBoard, setEnemyBoard ] = useState()
    const [ state, setState ] = useState()
    const [ error, setError ] = useState(null)
    const [ playerClickCell, setPlayerClickCell ] = useState(() => {})
    const [ enemyClickCell, setEnemeyClickCell ] = useState(() => {})
    const [ shipsToPlace, setShipsToPlace ] = useState([])
    const [ attackTurn, setAttackTurn ] = useState(false)



    const handleResponse = useCallback((response) => {
        response.then(response => {
            if (!response.ok) {
                return response.text().then(text=>{throw new Error(text)})
            }
            return response.json()
        })
        .then(response => {
            setSessionToken(response.token)
            setBoard(response.board)
            setEnemyBoard(response.enemyBoard)
            setState(response.state)
            setAttackTurn(response.attackTurn)
            setError(null)
            setShipsToPlace((prevShips) => {
                const newShips = difference(SHIP_NAMES, Object.keys(response.board.ships))
                if (isEqual(newShips, prevShips)) {
                    return prevShips
                }
                return newShips
            })
        })
        .catch(err => {
            setError(err.message)
            console.error(err.message);
        })
    }, [setSessionToken])

    const fetchData = useCallback(() => {
        if (!sessionToken) {
            return
        }
        console.log('fetch')
        const getUrl = new URL(backendUrl)
        getUrl.pathname = `response/${id}`
        getUrl.searchParams.set('token', sessionToken)
        handleResponse(
            fetch(getUrl, {
                mode:'cors',
                method:'GET'
            })
        )
    }, [id, backendUrl, sessionToken, handleResponse])

    const placeShip = useCallback((shipName, x, y, vertical) => {
        const postUrl = new URL(backendUrl)
        postUrl.pathname = `place/${id}`
        handleResponse(
            fetch(postUrl, {
                mode:'cors',
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({
                    token: sessionToken,
                    playerId: 1,
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
    }, [backendUrl, sessionToken, id, handleResponse])

    const attack = useCallback((x, y) => {
        const postUrl = new URL(backendUrl)
        postUrl.pathname = `attack/${id}`
        handleResponse(
            fetch(postUrl, {
                mode:'cors',
                method:'POST',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify({
                    token: sessionToken,
                    position: {
                        x,
                        y
                    }
                })
            })
        )
    }, [backendUrl, id, sessionToken, handleResponse])

    useEffect(() => {
        console.log('join effect');
        if (!sessionToken) {
            const postUrl = new URL(backendUrl)
            postUrl.pathname = `join/${id}`
            handleResponse(
                fetch(postUrl, {
                    mode:'cors',
                    method:'POST'
                })
            )
        }
    }, [backendUrl, id, sessionToken, handleResponse])

    useEffect(() => {
        console.log('fetch effect');
        fetchData()
        let intervalId
        if ((!attackTurn && state === 'battle') || (shipsToPlace.length === 0 && state === 'place')) {
            console.log('interval');
            intervalId = setInterval(fetchData, 1000)
        }
        return (() => clearInterval(intervalId))
    }, [fetchData, attackTurn, shipsToPlace, state])

    useEffect(() => {
        console.log('state effect');
        switch (state) {
            case "place":
                setEnemeyClickCell(() => () => {})
                if (shipsToPlace.length > 0) {
                    setPlayerClickCell(() => (x, y) => {placeShip(shipsToPlace[0], x, y, false)})
                } else {
                    setPlayerClickCell(() => () => {})
                }
                break;
            case "battle":
                setPlayerClickCell(() => () => {})
                if (attackTurn) {
                    setEnemeyClickCell(() => (x, y) => {attack(x, y)})
                } else {
                    setEnemeyClickCell(() => () => {})
                }
                break
            case "finish":
                setPlayerClickCell(() => () => {})
                setEnemeyClickCell(() => () => {})
                break
            default:

                break;
        }
    }, [attack, placeShip, shipsToPlace, state, attackTurn])




    return (
        <div className="game">
            <GameHeader id={id} state={state} attackTurn={attackTurn}/>
            Game {id} {sessionToken} {state} {attackTurn?'attack':'wait'}
            {error}
            <PlayerBoard board={board} clickCell={playerClickCell}/>
            <PlayerBoard board={enemyBoard} clickCell={enemyClickCell}/> 
        </div>
    )
}