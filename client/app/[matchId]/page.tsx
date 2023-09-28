import OnlineGame from "@/components/OnlineGame"

export default function MatchRender({
	params
} : {
	params: { matchId : string}
}){

	return(
		<OnlineGame
			matchId={params.matchId}
		/>
	)
}