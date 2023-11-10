"use client";

import Link from "next/link";
import { useState } from "react";

function RenderGrid(props: {
    grid: Array<number>;
    callback: (b: boolean) => void;
    status?: boolean;
}) {
    return (
        <div className="grid grid-cols-3 gap-2">
            {props.grid.map((_, index, arr) => {
                if (index % 3 !== 0) {
                    return null;
                }

                let rowNum = Math.floor(index / 9);
                let colNum = index % 9;
                let paddingTop = rowNum % 3 === 0 && rowNum !== 0 ? "mt-4" : "";
                let paddingRight = colNum % 3 !== 2 ? "mr-4" : "";
                let squareStyles =
                    "w-10 bg-blue-300 leading-10 text-black text-2xl";
                return (
                    <div
                        className={`grid grid-cols-3 gap-2 text-center ${paddingTop} ${paddingRight}`}
                        key={index}
                    >
                        {[arr[index], arr[index + 1], arr[index + 2]].map(
                            (val, subIndex) => (
                                <p
                                    className={squareStyles}
                                    onClick={() => {
                                        arr[index + subIndex] = -1;
                                        if (
                                            props.callback !== undefined &&
                                            props.status !== undefined
                                        ) {
                                            props.callback(!props.status);
                                        }
                                    }}
                                    key={index + subIndex}
                                >
                                    {val !== 0 ? val : null}
                                </p>
                            )
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default function Sudoku() {
    const [grid, setGrid] = useState(makeNewGrid());
    const [shouldRefresh, setShouldRefresh] = useState(false);

    function makeNewGrid(): Array<number> {
        return new Array<number | null>(81)
            .fill(null)
            .map((val, index) => index);
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

                <RenderGrid
                    grid={grid}
                    callback={setShouldRefresh}
                    status={shouldRefresh}
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
