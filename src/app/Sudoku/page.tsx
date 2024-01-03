"use client";

import Link from "next/link";
import { ChangeEvent, RefObject, createRef, useState } from "react";

function RenderSudokuGrid(props: {
    grid: Array<number>;
    refresh: () => void;
    refsGrid: Array<RefObject<any>>;
}) {
    function handleInput(
        event: ChangeEvent<HTMLInputElement>,
        index: number,
        subIndex: number
    ) {
        if (event.target.value == "" && index + subIndex - 1 >= 0) {
            props.refsGrid[index + subIndex - 1].current.focus();
            props.grid[index + subIndex] = 0;
        } else if (index + subIndex + 1 < 81) {
            props.refsGrid[index + subIndex + 1].current.focus();
            props.grid[index + subIndex] = event.target.valueAsNumber;
        }

        props.refresh();
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
                                className="w-10 bg-blue-300 text-center text-2xl leading-10 text-black"
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

function NewGridFromString(props: {
    grid: Array<number>;
    refresh: () => void;
}) {
    const [showInput, setShowInput] = useState(false);

    function handleInput(event: ChangeEvent<HTMLInputElement>) {
        if (
            event.target.value.length !== 81 ||
            isNaN(event.target.valueAsNumber) ||
            event.target.value === undefined
        ) {
            event.target.value = "";
        }

        const s = event.target.value;
        for (let i = 0; i < 81; i++) {
            props.grid[i] = parseInt(s.at(i) as string);
        }

        setShowInput(!showInput);
        props.refresh();
    }

    return (
        <div className="mx-4 text-2xl">
            {showInput ? (
                <div>
                    <input
                        type="number"
                        className="w-72 bg-blue-300 text-center text-2xl leading-10 text-black placeholder:text-neutral-800"
                        placeholder="Paste 81 digit string here"
                        onChange={handleInput}
                    />
                    <button
                        className="ml-4 px-2 py-1"
                        onClick={() => setShowInput(!showInput)}
                    >
                        Cancel
                    </button>
                    <p className="text-lg">
                        Example:
                        010020300004005060070000008006900070000100002030048000500006040000800106008000000
                    </p>
                </div>
            ) : (
                <button
                    className="px-2 py-1"
                    onClick={() => setShowInput(!showInput)}
                >
                    Set Grid From String
                </button>
            )}
        </div>
    );
}

export default function Sudoku() {
    const [grid, setGrid] = useState(makeNewBlankGrid());
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const [refsGrid, setRefsGrid] = useState(makeNewRefsGrid());

    function makeNewIndexGrid(): Array<number> {
        return new Array<number | null>(81).fill(null).map((_, index) => index);
    }

    function makeNewBlankGrid(): Array<number> {
        return new Array<number>(81).fill(0);
    }

    function makeNewRefsGrid(): Array<RefObject<HTMLInputElement>> {
        return new Array<RefObject<HTMLInputElement> | null>(81)
            .fill(null)
            .map(() => createRef());
    }

    // TODO: y0
    // function handleSolve() {
    //     return;
    // }

    function handleCheckValid() {
        for (let i = 0; i < 81; i++) {
            if (verifySingleSquare(i)) {
                alert(`Invalid solution. Error on square ${i + 1}`);
                return;
            }
        }

        alert("Sudoku is valid!");
    }

    function verifySingleSquare(i: number): boolean {
        const squareValue = refsGrid.at(i)?.current?.valueAsNumber ?? 0;
        if (squareValue === 0 || isNaN(squareValue)) return true;

        const rowStart = Math.floor(i / 9) * 9;
        for (let rowIndex = rowStart; rowIndex < rowStart + 9; rowIndex++) {
            Math.floor(i / 9) * 9;
            if (grid[rowIndex] === squareValue && rowIndex !== i) {
                refsGrid.at(i)?.current?.select();
                return true;
            }
        }

        for (let colIndex = i % 9; colIndex < 81; colIndex += 9) {
            if (grid[colIndex] === squareValue && colIndex !== i) {
                refsGrid.at(i)?.current?.select();
                return true;
            }
        }

        return false;
    }

    return (
        <div className="text-center">
            <p className="my-4 select-none text-5xl font-medium">
                Sudoku Verifier
            </p>
            <div className="flex">
                <div className="mx-auto">
                    <RenderSudokuGrid
                        grid={grid}
                        refresh={() => setShouldRefresh(!shouldRefresh)}
                        refsGrid={refsGrid}
                    />
                </div>
            </div>

            <div>
                {/* <button
                        className="mx-4 my-4 px-2 py-1 text-2xl"
                        onClick={handleSolve}
                    >
                        Solve
                    </button> */}
                <button
                    className="mx-4 my-4 px-2 py-1 text-2xl"
                    onClick={handleCheckValid}
                >
                    Check Solution
                </button>
                <button
                    className="mx-4 my-4 px-2 py-1 text-2xl"
                    onClick={() => setGrid(makeNewBlankGrid())}
                >
                    Clear Grid
                </button>
                <br />
                <NewGridFromString
                    grid={grid}
                    refresh={() => setShouldRefresh(!shouldRefresh)}
                />
                <br />
                <Link href={"/"}>
                    <button className="mx-4 my-4 -mt-2 px-2 py-1 text-2xl">
                        Back To Home
                    </button>
                </Link>
            </div>
        </div>
    );
}
