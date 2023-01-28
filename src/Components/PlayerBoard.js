const BOARD_SIZE = 10

export default function PlayerBoard({board}) {
    const cells = []
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            cells.push(
                <div 
                    data-x={j} 
                    data-y={i} 
                    key={`${j}${i}`} 
                    onClick={(e) => {}
                }>
                    test
                </div>)
        }
    }

    console.log(cells);
    return (
        <>
            {cells}
        </>    
    )
}