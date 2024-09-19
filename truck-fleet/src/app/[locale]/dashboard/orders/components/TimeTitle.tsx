"use client";
import {
	Era,
	format,
	FormatLongFnOptions,
	LocaleDayPeriod,
	LocalizeFnOptions,
	Month,
	Quarter,
} from "date-fns";
import React, { useEffect, useState } from "react";
import { TextEffect } from "../../../../../components/ui/text-effect";
import { useTranslations } from "next-intl";

export default function TimeTitle() {
	const [time, setTime] = useState(new Date());
	const t = useTranslations("TimeTitle");

	useEffect(() => {
		if (typeof window !== "undefined") {
			const interval = setInterval(() => {
				setTime(new Date());
			}, 1000);

			return () => clearInterval(interval);
		}
	}, []);

	return (
		<div className="text-3xl font-bold py-4 flex gap-2">
			<h1 className="capitalize flex items-center gap-2">
				<div className="">{t(format(time, "MMM").toLowerCase() as any)}</div>
				<div className="">{format(time, "d, yyyy").toLowerCase()}</div>|
				<div className="uppercase">{format(time, "pp").toLowerCase()}</div>
			</h1>

			<div className="flex gap-3 items-end ">
				<span className="text-sm capitalize">
					{t(format(time, "EEEE").toLowerCase() as any)}
				</span>
			</div>
		</div>
	);
}
