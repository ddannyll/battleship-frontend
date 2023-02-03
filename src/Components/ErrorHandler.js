import ErrorNotification from "./ErrorNotification"

export default function ErrorHandler({errors}) {
    const displayedErrors = errors
        .map(
            (error, index) => (
                <ErrorNotification key={index} dismiss={error.dismiss} message={error.message} dismissed={error.dismissed}/>
            )
        )
    return (
        <div className="errorHandler">
            {displayedErrors}
        </div>
    )
}