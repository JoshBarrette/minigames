import Link from "next/link";

function GameButton(props: { href: string; label: string }) {
    return (
        <Link href={props.href}>
            <button className="my-1 rounded-md bg-gray-200 px-4 py-2 font-sans text-3xl shadow transition-all hover:bg-gray-400 active:bg-gray-800 active:text-white">
                {props.label}
            </button>
        </Link>
    );
}

export default function Home() {
    return (
        <div className="flex h-screen text-center">
            <div className="m-auto">
                <h1 className="mb-5 select-none text-6xl font-medium">
                    MiniGames
                </h1>

                <GameButton href="/TicTacToe" label="Tic Tac Toe" />
                <br />
                <GameButton href="/Minesweeper" label="Minesweeper" />
                <br />
                <GameButton href="#" label="Snake Game" />
                <br />
                <GameButton href="#" label="Type Racer" />
            </div>
        </div>
    );
}
