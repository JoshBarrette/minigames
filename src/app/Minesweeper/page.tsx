"use client";

import { useState } from "react";

type SquareData = {
    status: number;
    isBomb: boolean;
};

enum squareStatus {
    flagged,
    mine,
    notClicked,
    cleared,
}
const squareImages = ["🚩", "💣", "⬜", "🟩"];

function Square(props: {
    data: SquareData;
    nearCount?: number;
    index: number;
    gridSize: number;
}) {
    const defaultColor = "bg-gray-950";
    const defaultAltColor = "bg-gray-800";
    const defaultHoverColor = "hover:bg-gray-500";

    const clearedColor = "bg-green-600";
    const clearedAltColor = "bg-green-700";
    const clearedHoverColor = "hover:bg-green-900";

    let bgColor = defaultColor;
    let hoverColor = defaultHoverColor;

    // Gotta get that checkerboard effect
    let isEvenRow = ((props.index / props.gridSize) % 2 | 0) === 0;
    if (props.data.status === squareStatus.cleared) {
        bgColor = clearedColor;
        hoverColor = clearedHoverColor;

        if (props.gridSize % 2 === 1 && props.index % 2 === 1) {
            bgColor = clearedAltColor;
        } else if (
            props.gridSize % 2 === 0 &&
            isEvenRow &&
            props.index % 2 === 1
        ) {
            bgColor = clearedAltColor;
        } else if (
            props.gridSize % 2 === 0 &&
            !isEvenRow &&
            props.index % 2 === 0
        ) {
            bgColor = clearedAltColor;
        }
    } else {
        if (props.gridSize % 2 === 1 && props.index % 2 === 1) {
            bgColor = defaultAltColor;
        } else if (
            props.gridSize % 2 === 0 &&
            isEvenRow &&
            props.index % 2 === 1
        ) {
            bgColor = defaultAltColor;
        } else if (
            props.gridSize % 2 === 0 &&
            !isEvenRow &&
            props.index % 2 === 0
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
                    {squareImages[props.data.status]}
                </div>
            ) : null}
        </div>
    );
}

export default function Minesweeper() {
    const [gridSize, setGridSize] = useState(10);
    const [grid, setGrid] = useState(
        new Array<SquareData | null>(gridSize * gridSize).fill(null).map(() => {
            return {
                status: squareStatus.notClicked,
                isBomb: false,
            };
        })
    );
    const [shouldRefresh, setShouldRefresh] = useState(false);

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
        setGrid(
            new Array<SquareData | null>(newSize * newSize)
                .fill(null)
                .map(() => {
                    return {
                        status: squareStatus.notClicked,
                        isBomb: false,
                    };
                })
        );
    }

    function addMines() {
        // TODO: y0
    }

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
            <div className="m-auto">
                <p className="select-none text-5xl font-medium">Minesweeper</p>
                <br />
                <div className={`m-auto mt-5 grid my-grid-cols-${gridSize}`}>
                    {grid.map((square, key) => (
                        <div onClick={() => handleSquareClick(key)}>
                            <Square
                                data={square}
                                key={key}
                                gridSize={gridSize}
                                index={key}
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
                <p className="select-none text-2xl font-medium">
                    Set Grid Size:
                </p>
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
            </div>
        </div>
    );
}
