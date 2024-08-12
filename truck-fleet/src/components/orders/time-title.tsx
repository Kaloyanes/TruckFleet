"use client";
import { format } from "date-fns";
import React from "react";
import { TextEffect } from "../ui/text-effect";

export default function TimeTitle() {
	const [time, setTime] = React.useState(new Date());

	React.useEffect(() => {
		if (typeof window !== "undefined") {
			const interval = setInterval(() => {
				setTime(new Date());
			}, 1000);

			return () => clearInterval(interval);
		}
	}, []);

	return (
		<div className="text-3xl font-bold py-4 flex gap-2">
			<h1>{format(time, "PP | pp")}</h1>

			<div className="flex gap-3 items-end ">
				<span className="text-sm">{format(time, "EEEE")}</span>
			</div>
		</div>
	);
}
