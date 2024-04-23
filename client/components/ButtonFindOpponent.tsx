import { useRouter } from "next/navigation";
import React from "react"
import { io } from "socket.io-client";

export default function ButtonFindOpponent({ disabled, callback }: { disabled: boolean, callback: any }) {
	const [isFinding, setIsFinding] = React.useState(false);
	const router = useRouter();
	
	const FindOpponent = async () => {
		setIsFinding(true);
		callback(true);
		
		const socket = io(process.env.NEXT_PUBLIC_REST_API_URL!);

		socket.emit('get_match');

		socket.on('info-match', (info : {matchId: string, mark : string, key: string}) => {
			sessionStorage.setItem('key', info.key);
			sessionStorage.setItem('mark', info.mark)
			socket.disconnect();
			router.push(`/${info.matchId}`);
		})

		socket.on('disconnect', () => {
			console.log("Disconnected")
		})
	}

	return (
		<div className="sm:w-1/3 w-2/3">
			<button className="w-full p-3 sm:p-4 border-8 border-[#333] md:text-lg gamefont outline-none bg-[#00000000] enabled:hover:bg-[#0000001a] enabled:hover:transformbtn"
				onClick={FindOpponent}
				disabled={disabled}
			>
				{
					!isFinding ?
						<p>Play online</p>
						:
						<p className="loading">Waiting for opponent</p>
				}
			</button>
		</div>
	)
}