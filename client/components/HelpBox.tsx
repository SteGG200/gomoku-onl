import Box from "./Box";

export default function HelpBox({callback, setShowHelpBox}: {callback: any, setShowHelpBox: any}){
	const closeFunction = () => {
		callback(false);
		setShowHelpBox(false);
	}

	return(
		<Box>
			<div className="w-11/12 sm:w-[700px] h-3/4 m-auto bg-slate-100 rounded p-6 text-xl space-y-2">
				<div className="flex justify-end">
					<button
						onClick={closeFunction}
					>
						<CloseIcon/>
					</button>
				</div>
				<span className="font-bold">RULE OF GOMOKU :</span>
				<br />
				<ul className="list-['-\0020'] space-y-2 list-inside">
					<li>
						You and your rival alternately place X or O on an empty square. The winner is the first player to form an unbroken line of 5 words which they own horizontally, vertically, or diagonally. If the board is completely filled and no one can make a line of 5 words, then the game ends in a draw.
					</li>
					<li>
						In an online game, player who has X plays first. Each player has totally 5 minutes for all movement.
					</li>
				</ul>
			</div>
		</Box>
	)
}

function CloseIcon(){
	return(
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
			<path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
		</svg>
	)
}