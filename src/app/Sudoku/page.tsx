"use client";

import assert from "assert";
import Link from "next/link";
import { ChangeEvent, RefObject, createRef, useRef, useState } from "react";

function RenderSudokuGrid(props: {
    grid: Array<number>;
    callback: (b: boolean) => void;
    status: boolean;
    refsGrid: Array<RefObject<any>>;
}) {
    function handleInput(
        event: ChangeEvent<HTMLInputElement>,
        index: number,
        subIndex: number
    ) {
        if (
            isNaN(event.target.valueAsNumber) ||
            event.target.valueAsNumber < 0
        ) {
            props.grid[index + subIndex] = 0;
            props.callback(!props.status);
            return;
        } else if (event.target.valueAsNumber < 99 && event.target.valueAsNumber >= 0) {
            props.grid[index + subIndex] = event.target.valueAsNumber % 10;
            console.log(index + subIndex);
            if (index + subIndex + 1 < 81) {
                props.refsGrid[index + subIndex + 1].current.focus();
            }
            props.callback(!props.status);
            return
        }

        // Need to reverse the number so that they go in in the right order
        let num = +event.target.valueAsNumber
            .toString()
            .split("")
            .reverse()
            .join("");
        let i = index + subIndex;
        while (num > 0 && i < 81) {
            props.grid[i] = num % 10;
            props.refsGrid[i].current.focus();
            i++;
            num = Math.floor(num / 10);
        }

        props.callback(!props.status);
    }

    // All of the sub-iteration is because of padding issues in grids
    return (
        <div className="grid grid-cols-3 gap-2">
            {props.grid.map((_, index) => {
                if (index % 3 !== 0) {
                    return null;
                }

                let rowNum = Math.floor(index / 9);
                let colNum = index % 9;
                let paddingTop = rowNum % 3 === 0 && rowNum !== 0 ? "mt-4" : "";
                let paddingRight = colNum % 3 !== 2 ? "mr-4" : "";
                let squareStyles =
                    "w-10 bg-blue-300 leading-10 text-black text-2xl text-center";
                return (
                    <div
                        className={`grid grid-cols-3 gap-2 text-center ${paddingTop} ${paddingRight}`}
                        key={index}
                    >
                        {[
                            props.grid[index],
                            props.grid[index + 1],
                            props.grid[index + 2],
                        ].map((val, subIndex) => (
                            <input
                                onChange={(e) =>
                                    handleInput(e, index, subIndex)
                                }
                                value={
                                    val !== 0 || isNaN(val)
                                        ? props.grid[index + subIndex]
                                        : ""
                                }
                                className={squareStyles}
                                type="number"
                                ref={props.refsGrid[index + subIndex]}
                                key={index + subIndex}
                            />
                        ))}
                    </div>
                );
            })}
        </div>
    );
}

export default function Sudoku() {
    const [grid, setGrid] = useState(makeNewGrid());
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const [refsGrid, setRefsGrid] = useState(makeNewRefsGrid());

    function makeNewGrid(): Array<number> {
        return new Array<number | null>(81)
            .fill(null)
            .map((val, index) => index);
    }

    function makeNewRefsGrid(): Array<RefObject<any>> {
        return new Array<RefObject<any> | null>(81)
            .fill(null)
            .map(() => createRef());
    }

    // TODO: y0
    function handleSolve() {
        return;
    }

    function handleCheckValid() {
        return;
    }

    return (
        <div className="flex h-screen text-center">
            <div className="m-auto">
                <p className="mb-4 select-none text-5xl font-medium">
                    Sudoku Solver
                </p>

                <RenderSudokuGrid
                    grid={grid}
                    callback={setShouldRefresh}
                    status={shouldRefresh}
                    refsGrid={refsGrid}
                />

                <div>
                    <button
                        className="mx-4 my-4 px-2 py-1 text-2xl"
                        onClick={handleSolve}
                    >
                        Solve
                    </button>
                    <button
                        className="mx-4 my-4 px-2 py-1 text-2xl"
                        onClick={handleCheckValid}
                    >
                        Check Solution
                    </button>
                    <Link href={"/"}>
                        <button className={"mx-4 my-4 mt-2 px-2 py-1 text-2xl"}>
                            Back To Home
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
