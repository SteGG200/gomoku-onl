import Box from './Box'

export default function WinnerBox(
	props: {
		children: React.ReactNode
	}
){
	return(
		<Box>
			<div className="w-11/12 sm:w-[400px] h-3/4 m-auto bg-slate-100 flex flex-col justify-center gap-20 rounded">
				{props.children}
			</div>
		</Box>
	)
}