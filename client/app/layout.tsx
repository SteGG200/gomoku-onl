import { Metadata } from "next";
import React from "react";
import '@/styles/styles.css'

export const metadata : Metadata = {
	title : "Gomoku",
	description : "A Gomoku game Online"
}

export default function LayoutRoot({
	children
} : {
	children : React.ReactNode
}){
	return(
		<html lang="en">
			<body>
				{children}
			</body>
		</html>
	)
}