import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import PlayerBoard from "./PlayerBoard"

export default function Game(props) {
    const { id } = useParams()
    const [ token, setToken ] = useState(null)
    const { backendUrl } = props
    const [ response, setResponse ] = useState('{}')

    useEffect(() => {
        const getUrl = new URL(backendUrl)
        getUrl.pathname = `response/${id}`
        getUrl.searchParams.set('token', token)
        fetch(getUrl, {
            mode:'cors',
            method:'GET'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            return response.json()
        })
        .then(response => {
            setToken(response.token)
            setResponse(JSON.stringify(response))
        })
        .catch(err => {
            console.error(err);
        })
    }, [])

    const responseObj = JSON.parse(response)
    const { board, enemyBoard, attackTurn, state, winner } = responseObj

    console.log(responseObj);


    return (
        <>
        Game {id} {token}
        <PlayerBoard board={board}/>
        </>
    )
}