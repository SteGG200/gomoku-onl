"use client"

import React from "react"
import Board from "./Board";
import { useBoard } from "@/hooks/useBoard";
import WinnerBox from "./WinnerBox";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OfflineGame(){
	// const [board, setBoard] = React.useState([
	// 	["X", "", "", "", "", "", "", ""],
	// 	["", "", "", "", "", "", "", ""],
	// 	["", "", "", "", "", "", "", ""],
	// 	["", "", "", "", "", "", "", ""],
	// 	["", "", "", "", "", "", "", ""],
	// 	["", "", "", "", "", "", "", ""],
	// 	["", "", "", "", "", "", "", ""],
	// 	["", "", "", "", "", "", "", ""]
	// ]);

	// const onClick = (i : number, j: number) => {
	// 	let copyBoard = [...board];
	// 	copyBoard[i][j] = "O";
	// 	setBoard(copyBoard);
	// }

	const [board, setBoard, getWinner] = useBoard();
	const [turn, setTurn] = React.useState("")
	const [newGame, setNewGame] = React.useState(true)
	const router = useRouter();

	const onClick = (i: number, j: number) => {
		setBoard(i, j, turn);
		if(turn === "X") setTurn("O")
		else if(turn === "O") setTurn("X")
	}

	const winner = getWinner();

	const playAgainOnClick = () => {
		board.forEach((row, i) => {
			row.forEach((cell, j) => {
				setBoard(i, j, "")
			})
		})
		setNewGame(true);
	}

	React.useEffect(() => {
		if(newGame){
			setTurn("XO"[Math.floor(Math.random() * 2)]);
			setNewGame(false);
		}
	},[newGame])

	return(
		<main className="h-screen flex flex-col justify-center">
			{
				winner &&
				<WinnerBox>
					<p
						className="text-center gamefont text-3xl sm:text-4xl"
					>
						{winner === "D" ? "Game is draw" : `Winner is ${winner}`}
					</p>
					<div className="flex flex-col gap-4">
						<button
							className="outline-0 gamefont bg-red-500 hover:bg-red-400 w-2/3 mx-auto p-2 rounded"
							onClick={playAgainOnClick}
						>
							Play again
						</button>
						<Link
							className="outline-0 gamefont bg-green-500 hover:bg-green-400 w-2/3 mx-auto p-2 rounded text-center"
							href="/"
						>
							Back to Home
						</Link>
					</div>
				</WinnerBox>
			}
			<Board
				table={board}
				onClick={onClick}
				caption={`Current turn : ${turn}`}
				disabled={winner !== undefined}
			/>
		</main>
	)
}