"use client";

import { useState } from "react";

enum squareStatus {
    flagged,
    mine,
    notClick,
    clicked,
}

const squareImages = ["🚩", "💣", "⬜", "🟩"];

function Square(props: { status: number; isBomb: boolean; nearCount?: number ; val: number; gridSize: number }) {
    let bgColor = "bg-gray-950";
    
    // Gotta get that checkerboard effect
    let row = (props.val / props.size) % 2 | 0;
    if (props.size % 2 === 1 && props.val % 2 === 1) {
        bgColor = "bg-gray-800";
    } else  if (props.size % 2 === 0 && row == 0 && props.val % 2 === 1) {
        bgColor = "bg-gray-800";
    } else if (props.size % 2 === 0 && row == 1 && props.val % 2 === 0) {
        bgColor = "bg-gray-800";
    }

    return (
        <div
            className={`flex h-8 w-8 ${bgColor} p-2 text-xs text-white hover:bg-gray-500`}
        >
            <div className="m-auto">{squareImages[props.status]}</div>
        </div>
    );
}

// TODO: probably need to redo the grid type :(
export default function Minesweeper() {
    const [gridSize, setGridSize] = useState(10);
    const [grid, setGrid] = useState(new Array<number>(gridSize * gridSize).fill(0));
    const buttonStyling =
        "my-1 rounded-md bg-gray-200 px-2 py-1 mx-3 font-sans text-xl shadow hover:bg-gray-400 active:bg-gray-800 active:text-white";

    function addMines() {
        // TODO:
    }
    
    function resizeGrid(newSize: number) {
        if (newSize === gridSize) {
            return;
        }

        setGridSize(newSize);
        setGrid(new Array<number>(newSize * newSize).fill(0));
    }

    return (
        <div className="flex h-screen text-center">
            <div className="m-auto">
                <p className="select-none text-5xl font-medium">Minesweeper</p>
                <br />
                <div className={`my-grid-cols-${gridSize} m-auto mt-5 grid`}>
                    {grid.map((_, key) => (
                        <Square
                            status={1}
                            isBomb={false}
                            key={key}
                            gridSize={gridSize}
                            val={key}
                        />
                    ))}
                </div>
                <p className="mt-3 select-none text-2xl font-medium">
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
