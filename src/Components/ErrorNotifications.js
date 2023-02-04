import './ErrorNotifications.css'

export default function ErrorNotifications({errors}) {
    const errorNotifications = errors.map(error => 
        <div className="errorNotification" key={error.id}>
            <h3>Something went wrong</h3>
            <p>{error.message}</p>
            <button onClick={error.dismiss}>Dismiss</button>
        </div>
    )
    return (
        <div>
            {errorNotifications}
        </div>
    )
}