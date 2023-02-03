import { useNavigate } from "react-router-dom"

export default function Home({backendUrl, setSessionToken, appendError}) {
    const navigate = useNavigate()

    const createGame = async () => {
        const url = new URL(backendUrl)
        url.pathname = 'create'
        try {
            let response = await fetch(url, {
                mode:'cors',
                method:'POST',
                headers:{'Content-Type':'application/json'},
            })
            if (!response.ok) {
                response = await response.text()
                throw new Error(response)
            }
            response = await response.json()
            const { gameId, token } = response
            setSessionToken(token)
            navigate(`/game/${gameId}`)
        } catch (err) {
            console.error(err);
            appendError(err.message)
        }
    }
    
    return (
        <>
            <button onClick={createGame}>Create Game</button>
        </>
    )
}