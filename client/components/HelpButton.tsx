export default function HelpButton({disabled, callback, setShowHelpBox} : {disabled: boolean, callback: any, setShowHelpBox: any}){
	const showHelpBox = () => {
		callback(true);
		setShowHelpBox(true);
	}

	return(
		<div className="sm:w-1/3 w-2/3">
			<button className="w-full p-3 sm:p-4 border-8 border-[#333] md:text-lg gamefont outline-none bg-[#00000000] enabled:hover:bg-[#0000001a] enabled:hover:transformbtn"
				disabled={disabled}
				onClick={showHelpBox}
			>
				How to play
			</button>
		</div>
	)
}