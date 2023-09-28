import NavigationButton from "@/components/NavigationButton";

export default function Home(){
	
	return(
		<main className="h-screen flex flex-col justify-center space-y-8">
			<p className="gamefont text-5xl sm:text-6xl text-center pb-8 max-sm:mx-1">
				Gomoku
			</p>
			<NavigationButton/>
		</main>
	)
}