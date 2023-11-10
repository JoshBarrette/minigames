"use client";

import Link from "next/link";
import React, { MouseEvent, useEffect, useRef, useState } from "react";

type SquareData = {
    status: number;
    isBomb: boolean;
    nearCount: number;
    index: number;
};

enum squareStatus {
    flagged,
    mine,
    notClicked,
    cleared,
}
const squareImages = ["🚩", "💣", "⬜", "🟩"];

function Square(props: { data: SquareData; gridSize: number }) {
    const defaultColor = "bg-gray-950";
    const defaultAltColor = "bg-gray-800";
    const defaultHoverColor = "hover:bg-gray-500";

    const clearedColor = "bg-green-600";
    const clearedAltColor = "bg-green-700";
    const clearedHoverColor = "hover:bg-green-900";

    const failColor = "bg-red-500";
    const failHoverColor = "hover:bg-red-700";

    let bgColor = defaultColor;
    let hoverColor = defaultHoverColor;

    // Gotta get that checkerboard effect
    const isEvenRow = Math.floor((props.data.index / props.gridSize) % 2) === 0;
    const isEvenGrid = props.gridSize % 2 === 0;
    if (props.data.status === squareStatus.cleared) {
        bgColor = clearedColor;
        hoverColor = clearedHoverColor;

        if (!isEvenGrid && props.data.index % 2 === 1) {
            bgColor = clearedAltColor;
        } else if (isEvenGrid && isEvenRow && props.data.index % 2 === 1) {
            bgColor = clearedAltColor;
        } else if (isEvenGrid && !isEvenRow && props.data.index % 2 === 0) {
            bgColor = clearedAltColor;
        }
    } else if (props.data.status === squareStatus.mine) {
        bgColor = failColor;
        hoverColor = failHoverColor;
    } else {
        if (!isEvenGrid && props.data.index % 2 === 1) {
            bgColor = defaultAltColor;
        } else if (isEvenGrid && isEvenRow && props.data.index % 2 === 1) {
            bgColor = defaultAltColor;
        } else if (isEvenGrid && !isEvenRow && props.data.index % 2 === 0) {
            bgColor = defaultAltColor;
        }
    }

    return (
        <div
            className={`flex h-8 w-8 ${bgColor} p-2 text-xs transition-all ${hoverColor}`}
        >
            {props.data.status === squareStatus.flagged ||
            props.data.status === squareStatus.mine ? (
                <div className="m-auto select-none">
                    {squareImages[props.data.status]}
                </div>
            ) : null}

            {props.data.status === squareStatus.cleared &&
            props.data.nearCount !== 0 ? (
                <p className="m-auto select-none text-black">
                    {props.data.nearCount}
                </p>
            ) : null}
        </div>
    );
}

function GameOverPopUp(props: { didWin: boolean }) {
    const bgColor = props.didWin ? "bg-green-400" : "bg-red-400";
    return (
        <div
            className={`pointer-events-none select-none rounded-md bg-opacity-80 px-8 py-4 text-3xl font-medium text-white ${bgColor}`}
        >
            {props.didWin ? <p>You Win!</p> : <p>You Lose!</p>}
        </div>
    );
}

// I really hate that this needs to be out here but for some reason updating
// state too fast will cause a race condition
let squaresRemaining = 0;

export default function Minesweeper() {
    const [gridSize, setGridSize] = useState(10);
    const [flagCount, setFlagCount] = useState((gridSize * gridSize) / 5);
    const [grid, setGrid] = useState<Array<SquareData>>(makeNewArray(gridSize));
    const [gameOver, setGameOver] = useState(false);
    const [didWin, setDidWin] = useState(false);
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const bombCount = useRef(0);

    useEffect(() => {
        document.title = "Minesweeper";
        squaresRemaining = gridSize * gridSize;
    }, []);

    // Need this to stop a race condition :woozy:
    useEffect(() => {
        addMines((gridSize * gridSize) / 5);
    }, [grid]);

    const buttonStyling = "mx-3 my-1 px-2 py-1 text-xl ";

    function makeNewArray(newSize: number): Array<SquareData> {
        let newArr = new Array<SquareData | null>(newSize * newSize)
            .fill(null)
            .map((_, key) => {
                return {
                    status: squareStatus.notClicked,
                    isBomb: false,
                    nearCount: 0,
                    index: key,
                };
            });

        return newArr;
    }

    function resizeGrid(newSize: number) {
        if (newSize === gridSize) {
            return;
        }

        setGridSize(newSize);
        makeNewGrid(newSize);
    }

    function makeNewGrid(newSize: number) {
        bombCount.current = 0;
        setFlagCount((newSize * newSize) / 5);
        setGrid(makeNewArray(newSize));
        setGridSize(newSize);
        setGameOver(false);
        setDidWin(false);
        squaresRemaining = gridSize * gridSize;
    }

    function addMines(numberOfMines: number) {
        if (numberOfMines < 0) {
            return;
        }

        for (let i = 0; i < numberOfMines; i++) {
            addSingleMine();
        }

        setFlagCount(numberOfMines);
    }

    function applyToBorderSquares(
        index: number,
        callback: (num: number) => void
    ) {
        // top row then bottom row
        if (index > gridSize - 1) {
            callback(index - gridSize);

            if (index % gridSize > 0) {
                callback(index - gridSize - 1);
            }
            if (index % gridSize < gridSize - 1) {
                callback(index - gridSize + 1);
            }
        }
        if (index < gridSize * (gridSize - 1)) {
            callback(index + gridSize);

            if (index % gridSize > 0) {
                callback(index + gridSize - 1);
            }
            if (index % gridSize < gridSize - 1) {
                callback(index + gridSize + 1);
            }
        }

        // left then right
        if (index % gridSize > 0) {
            callback(index - 1);
        }
        if (index % gridSize < gridSize - 1) {
            callback(index + 1);
        }
    }

    function addSingleMine() {
        if (bombCount.current === gridSize * gridSize) {
            return;
        }

        let num = Math.floor(Math.random() * (gridSize * gridSize));
        while (grid[num].isBomb === true) {
            num = Math.floor(Math.random() * (gridSize * gridSize));
        }

        applyToBorderSquares(num, (i) => grid[i].nearCount++);

        grid[num].isBomb = true;
        bombCount.current++;
    }

    function revealAllBombs() {
        grid.map((square) => {
            if (square.isBomb) {
                square.status = squareStatus.mine;
            }
        });
    }

    function handleSquareClick(index: number) {
        if (
            gameOver ||
            grid[index].status === squareStatus.cleared ||
            grid[index].status === squareStatus.flagged
        ) {
            return;
        } else if (
            !grid[index].isBomb &&
            grid[index].nearCount === 0 &&
            grid[index].status === squareStatus.notClicked
        ) {
            // click all surrounding squares
            grid[index].status = squareStatus.cleared;
            squaresRemaining--;

            applyToBorderSquares(index, (i) => handleSquareClick(i));

            setShouldRefresh(!shouldRefresh);
        } else if (
            grid[index].isBomb === false &&
            grid[index].status === squareStatus.notClicked
        ) {
            grid[index].status = squareStatus.cleared;
            squaresRemaining--;
            setShouldRefresh(!shouldRefresh);
        } else if (grid[index].isBomb === true) {
            grid[index].status = squareStatus.mine;
            revealAllBombs();
            setGameOver(true);
        }

        if (squaresRemaining === (gridSize * gridSize) / 5 && !gameOver) {
            setGameOver(true);
            setDidWin(true);
        }
    }

    function handleSquareRightClick(index: number, event: MouseEvent) {
        event.preventDefault();

        if (gameOver) {
            return;
        } else if (grid[index].status === squareStatus.notClicked) {
            grid[index].status = squareStatus.flagged;
            setFlagCount(flagCount - 1);
        } else if (grid[index].status === squareStatus.flagged) {
            grid[index].status = squareStatus.notClicked;
            setFlagCount(flagCount + 1);
        }
    }

    return (
        <div className="flex h-screen text-center">
            <div className="m-auto block">
                <p className="select-none text-5xl font-medium">Minesweeper</p>

                <p className="mb-1 select-none">
                    {squareImages[squareStatus.flagged]}: {flagCount}
                </p>
                <div
                    className={`m-auto mb-4 grid w-fit my-grid-cols-${gridSize}`}
                >
                    {grid.map((square, key) => (
                        <div
                            onClick={() => handleSquareClick(key)}
                            onContextMenu={(e) =>
                                handleSquareRightClick(key, e)
                            }
                            key={gridSize * 100 + key}
                        >
                            <Square
                                data={square}
                                gridSize={gridSize}
                            />
                        </div>
                    ))}
                </div>

                <button
                    className={buttonStyling}
                    onClick={() => {
                        makeNewGrid(gridSize);
                    }}
                >
                    Reset Game
                </button>
                <p className="select-none text-2xl font-medium">
                    Set Grid Size:
                </p>
                <button className={buttonStyling} onClick={() => resizeGrid(5)}>
                    5x5
                </button>
                <button
                    className={buttonStyling}
                    onClick={() => resizeGrid(10)}
                >
                    10x10
                </button>
                <button
                    className={buttonStyling}
                    onClick={() => resizeGrid(15)}
                >
                    15x15
                </button>
                <button
                    className={buttonStyling}
                    onClick={() => resizeGrid(20)}
                >
                    20x20
                </button>

                <br />

                <Link href={"/"}>
                    <button className={buttonStyling + "mt-2"}>
                        Back To Home
                    </button>
                </Link>
            </div>

            <div
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform transition-all ${
                    gameOver ? "scale-100" : "scale-0"
                }`}
            >
                <GameOverPopUp didWin={didWin} />
            </div>
        </div>
    );
}
