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
	const yourMark = React.useRef("");
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
		yourMark.current = sessionStorage.getItem('mark')!

		socket.emit('ready_for_match', {
			matchId: props.matchId,
			key: sessionStorage.getItem('key')
		})
		console.log("ready")
		
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

		socket.on('start_match', (res: {status: number}) => {
			setLoadingGame(false);
			window.addEventListener("beforeunload", beforeunloadHandler); // Add beforeunload event
			if(yourMark.current){
				if(yourMark.current !== turn.current){
					opponentTime.start();
				}else{
					yourTime.start();
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
	},[])

	const moveHandler = (i: number, j : number) => {
		socket.emit('movement',{
			i,
			j,
			mark : yourMark.current,
			matchId: props.matchId
		})
	}

	const zeroPad = (num : number, places : number) => String(num).padStart(places, '0');

	if(opponentTime.time <= 0){
		opponentTime.stop();
		winner.current = yourMark.current;
	}

	if(yourTime.time <= 0){
		yourTime.stop();
		if(yourMark.current === "X"){
			winner.current = "O"
		}else{
			winner.current = "X"
		}
	}

	// Handle when game is over
	React.useEffect(() => {
		if(winner.current || !opponentConnection){
			yourTime.stop();
			opponentTime.stop();
			ResetStorage();
			window.removeEventListener("beforeunload", beforeunloadHandler);
			if(winner.current && winner.current === yourMark.current){
				const WinnerSound = new Audio('./sounds/WinnerSound.wav');
				WinnerSound.play();
			}
		}
	},[winner.current, opponentConnection]) 

	const playAgainOnClick = () => {
		// ResetStorage();
		socket.disconnect();
		router.push('/');
	}

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
									{winner.current === "D" ? "Game is Draw" : `${winner.current === yourMark.current ? "You win!" : "You lose"}`}
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
							running = {yourMark.current !== turn.current}
						>
							{Math.floor(Math.floor(opponentTime.time / 1000) / 60)} : {zeroPad(Math.floor(opponentTime.time / 1000) % 60, 2)}
						</TimeShow>
					</UserDetails>
					<Board
						table={board}
						onClick={moveHandler}
						disabled={turn.current !== yourMark.current || winner.current !== undefined}
					/>
					<UserDetails>
						<p>You are <b>{yourMark.current}</b>! Your time:</p>
						<TimeShow
							running = {yourMark.current === turn.current}
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

function beforeunloadHandler(event: BeforeUnloadEvent){
	event.preventDefault();
}