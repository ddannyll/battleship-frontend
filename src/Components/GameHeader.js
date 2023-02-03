export default function GameHeader({ id, state, attackTurn }) {
    return (
        <div className="gameHeader">
            {state} {`${attackTurn}`}
        </div>
    )
}