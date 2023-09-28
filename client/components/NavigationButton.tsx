"use client"

import React from "react";
import ButtonFindOpponent from "./ButtonFindOpponent";
import ButtonPlayOffline from "./ButtonPlayOffline";

export default function NavigationButton(){
	const [isPressBtn, setIsPressBtn] = React.useState(false);

	return(
		<div className="flex flex-col flex-wrap items-center space-y-4">
			<ButtonFindOpponent disabled={isPressBtn} callback={setIsPressBtn}/>
			<ButtonPlayOffline disabled={isPressBtn} callback={setIsPressBtn}/>
		</div>
	)
}