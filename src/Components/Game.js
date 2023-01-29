import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import PlayerBoard from "./PlayerBoard"
import { difference } from "lodash"

const SHIP_NAMES = [
    'carrier',
    'battleship',
    'submarine',
    'destroyer',
    'patrolBoat',
]


export default function Game(props) {
    const { id } = useParams()
    const { backendUrl } = props
    const [ token, setToken ] = useState()
    const [ board, setBoard ] = useState()
    const [ enemyBoard, setEnemyBoard ] = useState()
    const [ state, setState ] = useState()
    const [ error, setError ] = useState(null)
    const [ playerClickCell, setPlayerClickCell ] = useState(() => {})
    const [ shipsToPlace, setShipsToPlace ] = useState([])

    const handleResponse = (response) => {
        response.then(response => {
            if (!response.ok) {
                return response.text().then(text=>{throw new Error(text)})
            }
            return response.json()
        })
        .then(response => {
            setToken(response.token)
            setBoard(response.board)
            setEnemyBoard(response.enemyBoard)
            setState(response.state)
            setError(null)
            setShipsToPlace(difference(SHIP_NAMES, Object.keys(response.board.ships)))
        })
        .catch(err => {
            setError(err.message)
            console.error(err.message);
        })
    }

    const fetchData = useCallback(() => {
        console.log('fetch')
        const getUrl = new URL(backendUrl)
        getUrl.pathname = `response/${id}`
        getUrl.searchParams.set('token', token)
        handleResponse(
            fetch(getUrl, {
                mode:'cors',
                method:'GET'
            })
        )
    }, [id, backendUrl, token])

    const placeShip = useCallback((shipName, x, y, vertical) => {
        const postUrl = new URL(backendUrl)
        postUrl.pathname = `place`
        handleResponse(
            fetch(postUrl, {
                mode:'cors',
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({
                    shipName,
                    playerId: 1,
                    position: {
                        x,
                        y
                    },
                    vertical
                })
            })
        )
        console.log('placing ship: ' + shipName);
    }, [backendUrl, token])

    const attack = (x, y) => {
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
    }


    useEffect(() => {
        fetchData()
    }, [fetchData])

    useEffect(() => {
        switch (state) {
            case "place":
                if (shipsToPlace.length > 0) {
                    setPlayerClickCell(() => (x, y) => {placeShip(shipsToPlace[0], x, y, false)})
                } else {
                    setPlayerClickCell(() => (() => {}))
                }
                break;
            case "battle":
                break
            case "finish":

                break
            default:

                break;
        }
    }, [placeShip, shipsToPlace, state])




    return (
        <>
        Game {id} {token}
        {error}
        <PlayerBoard board={board} clickCell={playerClickCell}/>
        </>
    )
}