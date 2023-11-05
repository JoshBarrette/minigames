"use client";

import Link from "next/link";
import { useRef, useState } from "react";

function GameOverPopUp(props: { winner?: string; moves?: number }) {
    let winnerString: string;
    if (props.winner === undefined) {
        winnerString = "Tie";
    } else {
        winnerString = `Winner: ${props.winner}`;
    }

    let moves: number;
    if (props.moves === undefined) {
        moves = 9;
    } else {
        moves = props.moves + 1;
    }

    return (
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-md bg-slate-800 bg-opacity-80">
            <p className="mb-5 select-none px-8 pt-4 text-3xl font-medium text-white">
                {winnerString}
                <br />
                Total Moves: {moves}
            </p>
        </div>
    );
}

export default function TicTacToe() {
    const baseGrid = [
        ["-", "-", "-"],
        ["-", "-", "-"],
        ["-", "-", "-"],
    ];

    const [player, setPlayer] = useState("X");
    const [grid, setGrid] = useState(baseGrid);
    const [gameIsActive, setGameIsActive] = useState(true);
    const [isDraw, setIsDraw] = useState(false);
    const moveCount = useRef(0);

    const resetGrid = () => {
        setGrid(baseGrid);
        setPlayer("X");
        setGameIsActive(true);
        setIsDraw(false);
        moveCount.current = 0;
    };

    const handleTileClick = (row: number, col: number) => {
        if (grid[row][col] !== "-" || !gameIsActive || isDraw) {
            return;
        }
        grid[row][col] = player;

        // check rows
        for (let i = 0; i < 3; i++) {
            if (
                grid[row][0] === grid[row][1] &&
                grid[row][1] === grid[row][2] &&
                grid[row][0] !== "-"
            ) {
                setGameIsActive(false);
                return;
            }
        }

        // check cols
        for (let i = 0; i < 3; i++) {
            if (
                grid[0][col] === grid[1][col] &&
                grid[1][col] === grid[2][col] &&
                grid[0][col] !== "-"
            ) {
                setGameIsActive(false);
                return;
            }
        }

        // check diags
        if (
            grid[0][0] === grid[1][1] &&
            grid[1][1] === grid[2][2] &&
            grid[0][0] !== "-"
        ) {
            setGameIsActive(false);
            return;
        } else if (
            grid[0][2] === grid[1][1] &&
            grid[1][1] === grid[2][0] &&
            grid[0][2] !== "-"
        ) {
            setGameIsActive(false);
            return;
        }

        if (player === "O") {
            setPlayer("X");
        } else {
            setPlayer("O");
        }

        if (++moveCount.current === 9) {
            setIsDraw(true);
        }
    };

    return (
        <div className="flex h-screen text-center">
            <div className="m-auto">
                <p className="mb-5 select-none text-5xl font-medium">
                    Tic Tac Toe
                </p>
                <p className="mb-5 select-none text-2xl font-medium">
                    Current player: {player}
                </p>

                <div className="mb-6 grid grid-cols-3 gap-4">
                    {grid.map((arr, row) => {
                        let keyCounter = 0;
                        return arr.map((currentChar, col) => (
                            <div
                                onClick={() => handleTileClick(row, col)}
                                className="h-24 w-20 select-none rounded-sm text-8xl hover:bg-gray-200"
                                key={keyCounter++}
                            >
                                {currentChar}
                            </div>
                        ));
                    })}
                </div>

                <button
                    className="rounded-md bg-gray-200 px-4 py-2 font-sans text-3xl shadow hover:bg-gray-400 active:bg-gray-800 active:text-white"
                    onClick={resetGrid}
                >
                    Reset Game
                </button>
                <br />
                <Link href="/">
                    <button className="mt-2 rounded-md bg-gray-200 px-4 py-2 font-sans text-3xl shadow hover:bg-gray-400 active:bg-gray-800 active:text-white">
                        Back To Home
                    </button>
                </Link>

                {!gameIsActive ? (
                    <GameOverPopUp winner={player} moves={moveCount.current} />
                ) : null}

                {isDraw ? <GameOverPopUp /> : null}
            </div>
        </div>
    );
}
