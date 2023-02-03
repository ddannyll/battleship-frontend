import './ErrorNotification.css'

export default function ErrorNotification({dismiss, message, dismissed}) {
    if (dismissed) {
        return null
    }
    return (
        <div className="errorNotification">
            <h3>Something went wrong</h3>
            <p>{message}</p>
            <button onClick={dismiss}>Dismiss</button>
        </div>
    )
}