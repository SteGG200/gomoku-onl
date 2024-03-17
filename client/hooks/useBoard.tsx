import React from "react";

export function useBoard() : [string[][], (i : number, j: number, value: string) => void, () => string | undefined]{
	const [board, setBoard] = React.useState([
		["", "", "", "", "", "", "", ""],
		["", "", "", "", "", "", "", ""],
		["", "", "", "", "", "", "", ""],
		["", "", "", "", "", "", "", ""],
		["", "", "", "", "", "", "", ""],
		["", "", "", "", "", "", "", ""],
		["", "", "", "", "", "", "", ""],
		["", "", "", "", "", "", "", ""]
	]);

	const setter = (i : number, j : number, value: string) => {
		let copyBoard = [...board];
		copyBoard[i][j] = value;
		setBoard(copyBoard);
	}

	const getWinner = () => {
		for(let i = 0; i < board.length; i++){
			for(let j = 0; j < board[i].length; j++){
				if(board[i][j] === "") continue;
				if(i + 4 < board.length && board[i][j] === board[i + 1][j] && board[i + 1][j] === board[i + 2][j] && board[i + 2][j] === board[i + 3][j] && board[i + 4][j]) return board[i][j];
				if(j + 4 < board[i].length && board[i][j] === board[i][j + 1] && board[i][j + 1] === board[i][j + 2] && board[i][j + 2] === board[i][j + 3] && board[i][j + 4]) return board[i][j];
				if(i + 4 < board.length && j + 4 < board[i].length && board[i][j] === board[i + 1][j + 1] && board[i + 1][j + 1] === board[i + 2][j + 2] && board[i + 2][j + 2] === board[i + 3][j + 3] && board[i][j] === board[i + 4][j + 4]) return board[i][j];
				if(i + 4 < board.length && j - 4 < board[i].length && board[i][j] === board[i + 1][j - 1] && board[i + 1][j - 1] === board[i + 2][j - 2] && board[i + 2][j - 2] === board[i + 3][j - 3] && board[i][j] === board[i + 4][j - 4]) return board[i][j]
			}
		}
		return undefined;
	}

	return [board, setter, getWinner];
}