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
            className={`flex h-8 w-8 ${bgColor} p-2 text-xs hover:transition-all ${hoverColor}`}
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

export default function Minesweeper() {
    const [gridSize, setGridSize] = useState(10);
    const [flagCount, setFlagCount] = useState((gridSize * gridSize) / 5);
    const [grid, setGrid] = useState(
        new Array<SquareData | null>(gridSize * gridSize)
            .fill(null)
            .map((_, key) => {
                return {
                    status: squareStatus.notClicked,
                    isBomb: false,
                    nearCount: 0,
                    index: key,
                };
            })
    );
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const bombCount = useRef(0);

    useEffect(() => {
        document.title = "Minesweeper";
    }, []);

    // Need this to stop a race condition :woozy:
    useEffect(() => {
        addMines((gridSize * gridSize) / 5);
    }, [grid]);

    const buttonStyling =
        "transition-all my-1 rounded-md bg-gray-200 px-2 py-1 mx-3 font-sans text-xl shadow hover:bg-gray-400 active:bg-gray-800 active:text-white ";

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
        setGrid(
            new Array<SquareData | null>(newSize * newSize)
                .fill(null)
                .map((_, key) => {
                    return {
                        status: squareStatus.notClicked,
                        isBomb: false,
                        nearCount: 0,
                        index: key,
                    };
                })
        );
        setGridSize(newSize);
    }

    function addMines(numberOfMines: number) {
        if (numberOfMines < 0) {
            return;
        }

        for (let i = 0; i < numberOfMines; i++) {
            console.log("adding a mine");
            addSingleMine();
        }

        setFlagCount(numberOfMines);
    }

    function addSingleMine() {
        if (bombCount.current === gridSize * gridSize) {
            return;
        }

        let num = Math.floor(Math.random() * (gridSize * gridSize));
        while (grid[num].isBomb === true) {
            num = Math.floor(Math.random() * (gridSize * gridSize));
            console.log("in the while loop here");
        }

        // top row then bottom row
        if (num > gridSize - 1) {
            grid[num - gridSize].nearCount++;

            if (num % gridSize > 0) {
                grid[num - gridSize - 1].nearCount++;
            }
            if (num % gridSize < gridSize - 1) {
                grid[num - gridSize + 1].nearCount++;
            }
        }
        if (num < gridSize * (gridSize - 1)) {
            grid[num + gridSize].nearCount++;

            if (num % gridSize > 0) {
                grid[num + gridSize - 1].nearCount++;
            }
            if (num % gridSize < gridSize - 1) {
                grid[num + gridSize + 1].nearCount++;
            }
        }

        // left then right
        if (num % gridSize > 0) {
            grid[num - 1].nearCount++;
        }
        if (num % gridSize < gridSize - 1) {
            grid[num + 1].nearCount++;
        }

        grid[num].isBomb = true;
        bombCount.current++;
    }

    // TODO: need to have this function cascade to all nearby squares with 0 nearby mines
    function handleSquareClick(index: number) {
        if (
            grid[index].status === squareStatus.cleared ||
            grid[index].status === squareStatus.flagged
        ) {
            return;
        } else if (grid[index].isBomb === false) {
            grid[index].status = squareStatus.cleared;
            setShouldRefresh(!shouldRefresh);
            return;
        } else if (grid[index].isBomb === true) {
            grid[index].status = squareStatus.mine;
            setShouldRefresh(!shouldRefresh);
            return;
        }

        setShouldRefresh(!shouldRefresh);
    }

    function handleSquareRightClick(index: number, event: MouseEvent) {
        event.preventDefault();

        if (grid[index].status === squareStatus.notClicked) {
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

                <p className="mb-1">
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
                        >
                            <Square
                                data={square}
                                key={key}
                                gridSize={gridSize}
                            />
                        </div>
                    ))}
                </div>

                <button
                    className={buttonStyling + "mt-3"}
                    onClick={() => {
                        makeNewGrid(gridSize);
                    }}
                >
                    Reset Game
                </button>
                <button
                    className={buttonStyling + "mt-3"}
                    onClick={() => addMines((gridSize * gridSize) / 5)}
                >
                    Add All Mines
                </button>
                <button
                    className={buttonStyling + "mt-3"}
                    onClick={() => addSingleMine()}
                >
                    Add Single Mine
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
        </div>
    );
}
