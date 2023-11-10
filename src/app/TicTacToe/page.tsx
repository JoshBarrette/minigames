"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function GameOverPopUp(props: { winner?: string; moves: number }) {
    let winnerString: string;
    let moves = props.moves + 1; // for some reason this needs to be a +1
    if (props.winner === undefined) {
        winnerString = "Tie";
        moves = 9;
    } else {
        winnerString = `Winner: ${props.winner}`;
    }

    return (
        <div className="pointer-events-none rounded-md bg-slate-800 bg-opacity-80">
            <p className="mb-5 select-none px-8 py-4 text-3xl font-medium text-white">
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
    const [moveCount, setMoveCount] = useState(0);

    useEffect(() => {
        document.title = "Tic Tac Toe";
    }, []);

    const resetGrid = () => {
        setGrid(baseGrid);
        setPlayer("X");
        setGameIsActive(true);
        setIsDraw(false);
        setMoveCount(0);
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

        if (moveCount + 1 === 9) {
            setMoveCount(9);
            setIsDraw(true);
            setGameIsActive(false);
        } else {
            setMoveCount(moveCount + 1);
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
                                className="h-24 w-20 select-none rounded-sm text-8xl transition-all hover:bg-gray-800"
                                key={keyCounter++}
                            >
                                <p>{currentChar}</p>
                            </div>
                        ));
                    })}
                </div>

                <button className="px-4 py-2 text-3xl" onClick={resetGrid}>
                    Reset Game
                </button>
                <br />
                <Link href="/">
                    <button className="mt-2 px-4 py-2 text-3xl">
                        Back To Home
                    </button>
                </Link>

                <div
                    className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform transition-all ${
                        gameIsActive ? "scale-0" : "scale-100"
                    }`}
                >
                    <GameOverPopUp
                        winner={isDraw ? undefined : player}
                        moves={moveCount}
                    />
                </div>
            </div>
        </div>
    );
}
