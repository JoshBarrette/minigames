"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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

    let bgColor = defaultColor;
    let hoverColor = defaultHoverColor;

    // Gotta get that checkerboard effect
    let isEvenRow = Math.floor((props.data.index / props.gridSize) % 2) === 0;
    if (props.data.status === squareStatus.cleared) {
        bgColor = clearedColor;
        hoverColor = clearedHoverColor;

        if (props.gridSize % 2 === 1 && props.data.index % 2 === 1) {
            bgColor = clearedAltColor;
        } else if (
            props.gridSize % 2 === 0 &&
            isEvenRow &&
            props.data.index % 2 === 1
        ) {
            bgColor = clearedAltColor;
        } else if (
            props.gridSize % 2 === 0 &&
            !isEvenRow &&
            props.data.index % 2 === 0
        ) {
            bgColor = clearedAltColor;
        }
    } else {
        if (props.gridSize % 2 === 1 && props.data.index % 2 === 1) {
            bgColor = defaultAltColor;
        } else if (
            props.gridSize % 2 === 0 &&
            isEvenRow &&
            props.data.index % 2 === 1
        ) {
            bgColor = defaultAltColor;
        } else if (
            props.gridSize % 2 === 0 &&
            !isEvenRow &&
            props.data.index % 2 === 0
        ) {
            bgColor = defaultAltColor;
        }
    }

    return (
        <div
            className={`flex h-8 w-8 ${bgColor} p-2 text-xs hover:transition-all ${hoverColor}`}
        >
            {props.data.status < 2 ? (
                <div className="m-auto select-none">
                    {/* {squareImages[props.data.status]} */}
                </div>
            ) : null}
            <p
                className={
                    (props.data.isBomb ? "text-red-400" : "text-yellow-400") + " m-auto"
                }
            >
                {props.data.nearCount}
            </p>
        </div>
    );
}

export default function Minesweeper() {
    const [gridSize, setGridSize] = useState(10);
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

    const buttonStyling =
        "transition-all my-1 rounded-md bg-gray-200 px-2 py-1 mx-3 font-sans text-xl shadow hover:bg-gray-400 active:bg-gray-800 active:text-white";

    function resizeGrid(newSize: number) {
        if (newSize === gridSize) {
            return;
        }

        setGridSize(newSize);
        makeNewGrid(newSize);
    }

    function makeNewGrid(newSize: number) {
        bombCount.current = 0;
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
    }

    function addMine(numberOfMines: number) {
        if (numberOfMines < 0) {
            return;
        }
        
        for (let i = 0; i < numberOfMines; i++) {
            addSingleMine();
        }
    }

    function addSingleMine() {
        let num = Math.floor(Math.random() * (gridSize * gridSize));
        while (grid[num].isBomb === true) {
            if (bombCount.current === gridSize * gridSize) {
                return;
            }
            num = Math.floor(Math.random() * (gridSize * gridSize));
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
        grid[num].status = squareStatus.mine;
        bombCount.current++;

        // TODO: remove when done
        setShouldRefresh(!shouldRefresh);
    }

    // TODO: need to have this function cascade to all nearby squares with 0 nearby mines
    function handleSquareClick(index: number) {
        // if (grid[index].status === squareStatus.cleared) {
        //     return;
        // } else if (grid[index].isBomb === true) {
        //     grid[index].status = squareStatus.mine;
        //     setShouldRefresh(!shouldRefresh);
        //     return;
        // }

        if (grid[index].status === squareStatus.cleared) {
            grid[index].status = squareStatus.flagged;
        } else {
            grid[index].status++;
        }

        setShouldRefresh(!shouldRefresh);
    }

    return (
        <div className="flex h-screen text-center">
            <div className="m-auto block">
                <p className="select-none text-5xl font-medium">Minesweeper</p>
                <br />

                <div
                    className={`m-auto mb-4 grid w-fit my-grid-cols-${gridSize}`}
                >
                    {grid.map((square, key) => (
                        <div onClick={() => handleSquareClick(key)}>
                            <Square
                                data={square}
                                key={key}
                                gridSize={gridSize}
                            />
                        </div>
                    ))}
                </div>

                <button
                    className={buttonStyling + " mt-3"}
                    onClick={() => makeNewGrid(gridSize)}
                >
                    Reset Game
                </button>
                <button
                    className={buttonStyling + " mt-3"}
                    onClick={() => addSingleMine()}
                >
                    Add Single Mine
                </button>
                <button
                    className={buttonStyling + " mt-3"}
                    onClick={() => addMine((gridSize * gridSize) / 5)}
                >
                    Add All Mines
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
                    <button className={buttonStyling + " mt-2"}>
                        Back To Home
                    </button>
                </Link>
            </div>
        </div>
    );
}
