export default function Box(
	props: {
		children: React.ReactNode
	}
){
	return(
		<div className="fixed w-full h-full bg-[#00000030] grid">
			{props.children}
		</div>
	)
}