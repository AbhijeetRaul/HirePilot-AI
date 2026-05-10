"use client";

import { CircularProgressbar } from "react-circular-progressbar";

type Props = {
  score: number;
};

export default function ScoreCircle({
  score,
}: Props) {
  return (
    <div className="w-48 h-48">
      <CircularProgressbar
        value={score}
        text={`${score}%`}
      />
    </div>
  );
}