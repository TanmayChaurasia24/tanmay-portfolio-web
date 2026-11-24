"use client";
import React, { useState, useEffect, useCallback } from "react";
import { TextFlippingBoard } from "@/components/ui/text-flipping-board";

const MESSAGES: string[] = [
  "EAT, CODE, SHIP \nand REPEAT \n- TANMAY",
  "Who needs garden when\n you have github? \n- TANMAY",
  "I burned 4 hours \n for this shit. \n  -TANMAY",
  "Eat 5 star and \n do everything \n -TANMAY",
  "LADIES AND GENTLEMEN \nWELCOME TO F#!@# C!@$ \n  -TANMAY",
];

export default function TextFlippingBoardDemo() {
  const [msgIdx, setMsgIdx] = useState(0);

  const next = useCallback(
    () => setMsgIdx((i) => (i + 1) % MESSAGES.length),
    [],
  );

  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-8 py-20">
      <TextFlippingBoard text={MESSAGES[msgIdx]} />
    </div>
  );
}

export { TextFlippingBoardDemo };
