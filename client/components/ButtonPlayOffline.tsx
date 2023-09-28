import { useRouter } from "next/navigation";

export default function ButtonPlayOffline({disabled, callback} : {disabled: boolean, callback: any}){
	const router = useRouter();

	const onClick = () => {
		callback(true);
		router.push('/offline')
	}

	return(
		<div className="sm:w-1/3 w-2/3">
			<button className="w-full p-3 sm:p-4 border-8 border-[#333] md:text-lg gamefont outline-none bg-[#00000000] enabled:hover:bg-[#0000001a] enabled:hover:transformbtn"
				onClick={onClick}
				disabled={disabled}
			>
				Play offline
			</button>
		</div>
	)
}