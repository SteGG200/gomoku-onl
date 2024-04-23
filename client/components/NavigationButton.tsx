"use client";

import React from "react";
import ButtonFindOpponent from "./ButtonFindOpponent";
import ButtonPlayOffline from "./ButtonPlayOffline";
import HelpButton from "./HelpButton";
import HelpBox from "./HelpBox";

export default function NavigationButton() {
  const [isPressBtn, setIsPressBtn] = React.useState(false);
	const [showHelpBox, setShowHelpBox] = React.useState(false);

  return (
    <>
			{
				showHelpBox &&
				<HelpBox callback={setIsPressBtn} setShowHelpBox={setShowHelpBox}/>
			}
      <div className="flex flex-col flex-wrap items-center space-y-4">
        <ButtonFindOpponent disabled={isPressBtn} callback={setIsPressBtn} />
        <ButtonPlayOffline disabled={isPressBtn} callback={setIsPressBtn} />
        <HelpButton disabled={isPressBtn} callback={setIsPressBtn} setShowHelpBox={setShowHelpBox}/>
      </div>
    </>
  );
}
