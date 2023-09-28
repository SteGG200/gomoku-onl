function XMark(){
	return(
		<svg xmlns="http://www.w3.org/2000/svg" className="w-4 sm:w-[1.5em] mx-auto" viewBox="0 0 384 512"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/></svg>
	)
}

function OMark(){
	return(
		<svg xmlns="http://www.w3.org/2000/svg" className="w-4 sm:w-[2em] mx-auto" viewBox="0 0 448 512"><path d="M224 96a160 160 0 1 0 0 320 160 160 0 1 0 0-320zM448 256A224 224 0 1 1 0 256a224 224 0 1 1 448 0z"/></svg>
	)
}

const marksRender = {
	X: <XMark/>,
	O: <OMark/>
}

export default function Board(
	props : {
		table: string[][],
		onClick: (i : number, j : number) => void,
		caption?: string;
		disabled?: boolean;
	}
){

	return(
		<div className="w-11/12 sm:w-[600px] mx-auto aspect-square">
			<table className="w-full h-full table-fixed">
				{
					props.caption && 
					<caption className="gamefont mb-2">{props.caption}</caption>
				}
				<tbody>
					{
						props.table.map((row, i) => {
							return (
								<tr key={i} className="max-sm:height-fixed sm:h-[74px]">
									{
										row.map((value, j) => {
											return <td key={j} className="border-4 sm:border-8 border-[#333] sm:hover:bg-[#00000030]" 
											onClick={() => {
													if(props.table[i][j] !== "" || props.disabled) return;
													const SoundOfYourMove = new Audio('./sounds/SoundOfYourMove.wav')
													SoundOfYourMove.play();
													props.onClick(i, j);
												}}
												>
													{value !== "" && marksRender[value == "X" ? "X" : "O"]}
												</td>
										})
									}
								</tr>
							)
						})
					}
				</tbody>
			</table>
		</div>
	)
}
