"use client"

import { useBoard } from "@/hooks/useBoard";
import { useRouter } from "next/navigation";
import React from "react";
import { io } from "socket.io-client"
import Board from "./Board";
import { useCountDown } from "@/hooks/useCountDown";
import WinnerBox from "./WinnerBox";
import LoadingOnlineGame from "./Loading";

export default function Game(props : {matchId : string}){
	const socket = React.useMemo(() => io(process.env.NEXT_PUBLIC_REST_API_URL!),[])
	const turn = React.useRef("X");
	const [yourMark, setYourMark] = React.useState("");
	const [board, setBoard, getWinner] = useBoard();
	const router = useRouter();
	const timelimit = 1000 * 60 * 5;
	const opponentTime = useCountDown(timelimit);
	const yourTime = useCountDown(timelimit);
	const [opponentConnection, setOpponentConnection] = React.useState(true);
	const [LoadingGame, setLoadingGame] = React.useState(true);
	
	const winner : React.MutableRefObject<string> | React.MutableRefObject<undefined> = React.useRef();

	winner.current = getWinner();
	
	React.useEffect(() => {
		setYourMark(sessionStorage.getItem('mark')!)

		socket.emit('start_match', {
			matchId: props.matchId,
			key: sessionStorage.getItem('key')
		})
		
		socket.on('warning', (res : {status: number, message?: string}) => {
			if(res.status === 401){
				router.push('/')
			}else if(res.status === 102){
				console.log(res.message);
				if(winner.current === undefined){
					setOpponentConnection(false);
					yourTime.stop();
					opponentTime.stop();
				}
			}
		})
		
		socket.on('op_move', (movement : {i : number, j : number, mark: string}) => {
			setBoard(movement.i, movement.j, movement.mark);
			if(sessionStorage.getItem('mark') !== turn.current){
				const SoundOfOpponentMove = new Audio('./sounds/SoundOfOpponentMove.wav')
				SoundOfOpponentMove.play();
			}

			if(turn.current === "X"){
				turn.current = "O"
			}else if(turn.current === "O"){
				turn.current = "X"
			}

			if(sessionStorage.getItem('mark') !== turn.current){
				opponentTime.start();
				yourTime.stop();
			}else{
				yourTime.start();
				opponentTime.stop();
			}
		})

		socket.on('disconnect', () =>{
			ResetStorage();
			console.log("Disconnected")
		})

		setLoadingGame(false);
	},[])

	React.useEffect(() => {
		// console.log("Here");
		if(yourMark){
			if(yourMark !== turn.current){
				opponentTime.start();
			}else{
				yourTime.start();
			}
		}
	},[yourMark])

	const onClick = (i: number, j : number) => {
		socket.emit('movement',{
			i,
			j,
			mark : yourMark,
			matchId: props.matchId
		})
	}

	const zeroPad = (num : number, places : number) => String(num).padStart(places, '0');

	const playAgainOnClick = () => {
		// ResetStorage();
		socket.disconnect();
		router.push('/');
	}

	if(opponentTime.time <= 0){
		opponentTime.stop();
		winner.current = yourMark;
	}

	if(yourTime.time <= 0){
		yourTime.stop();
		if(yourMark === "X"){
			winner.current = "O"
		}else{
			winner.current = "X"
		}
	}

	React.useEffect(() => {
		if((winner.current && winner.current === yourMark) || !opponentConnection){
			const WinnerSound = new Audio('./sounds/WinnerSound.wav');
			WinnerSound.play();
			ResetStorage();
		}
	},[winner.current, opponentConnection])

	return(
		<main className="h-screen flex flex-col justify-center space-y-3">
			{
				LoadingGame ?
				<LoadingOnlineGame/>
				:
				<>
					{
						(winner.current || !opponentConnection) &&
						<WinnerBox>
							{
								winner.current ? 
								<p
									className="text-center gamefont text-3xl sm:text-4xl"
								>
									{winner.current === yourMark ? "You win!" : "You lose"}
								</p>
								:
								<p
									className="text-center gamefont text-2xl sm:text-3xl"
								>
									Your opponent is disconnected!
								</p>
							}
							<button
									className="outline-0 gamefont bg-green-500 hover:bg-green-400 w-2/3 mx-auto p-2 rounded text-center"
									onClick={playAgainOnClick}
								>
									Play again
							</button>
						</WinnerBox>
					}
					<UserDetails>
						<p>Your opponent's time:</p>
						<TimeShow
							running = {yourMark !== turn.current}
						>
							{Math.floor(Math.floor(opponentTime.time / 1000) / 60)} : {zeroPad(Math.floor(opponentTime.time / 1000) % 60, 2)}
						</TimeShow>
					</UserDetails>
					<Board
						table={board}
						onClick={onClick}
						disabled={turn.current !== yourMark || winner.current !== undefined}
					/>
					<UserDetails>
						<p>You are <b>{yourMark}</b>! Your time:</p>
						<TimeShow
							running = {yourMark === turn.current}
						>
							{Math.floor(Math.floor(yourTime.time / 1000) / 60)} : {zeroPad(Math.floor(yourTime.time / 1000) % 60, 2)}
						</TimeShow>
					</UserDetails>
				</>
			}
		</main>
	)
}

function UserDetails({ children } : { children: React.ReactNode}){
	return(
		<div className="w-11/12 sm:w-[600px] mx-auto gamefont text-sm flex justify-between">
			{children}
		</div>
	)
}

function TimeShow(props : {
	children : React.ReactNode,
	running : boolean
}){
	return(
		<div className={`${props.running ? "bg-[#333] text-slate-50" : "bg-slate-50 text-[#333]"} p-1 rounded-sm text-center w-[70px]`}>
			{props.children}
		</div>
	)
}

function ResetStorage(){
	sessionStorage.removeItem('mark');
  sessionStorage.removeItem('key');
  sessionStorage.removeItem('username');
}