import styles from "./styles.module.css"

import Link from 'next/link'

export default async function Home() {
    return (
        <div id={styles.mainDiv}>
            <h1 id={styles.heading}>MiniGames</h1>

            <Link href="/TicTacToe">
                <button className={styles.button} type="button">
                    Tic Tac Toe
                </button>
            </Link>
            <br />
            <Link href="/">
                <button className={styles.button} type="button">
                    Snake Game
                </button>
            </Link>
            <br />
            <Link href="/">
                <button className={styles.button} type="button">
                    Minesweeper
                </button>
            </Link>
            <br />
            <Link href="/">
                <button className={styles.button} type="button">
                    Type Racer
                </button>
            </Link>
        </div>
    );
};
