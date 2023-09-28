import React from 'react';

export function useCountDown(initialTime: number){
	const [time, setTime] = React.useState(initialTime);
	const leftTime = React.useRef(initialTime);
	const currentTime = React.useRef(0);
	const endTime = React.useRef(0)
	const intervalFunc : any = React.useRef(false);

	const start = () => {
		currentTime.current = new Date().getTime();
		endTime.current = currentTime.current + leftTime.current;
		intervalFunc.current = setInterval(() => {
			currentTime.current = new Date().getTime();
			leftTime.current = endTime.current - currentTime.current;
			setTime(() => leftTime.current)
		}, 10);
	}

	const stop = () => {
		if(intervalFunc.current){
			clearInterval(intervalFunc.current);
		}
		intervalFunc.current = false;
	}

	return {time, start, stop}
}