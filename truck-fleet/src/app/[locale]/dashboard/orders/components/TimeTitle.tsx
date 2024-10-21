"use client";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

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
		<div className="flex gap-2 py-4 font-bold text-3xl">
			<h1 className="flex items-center gap-2 capitalize">
				<div>{t(format(time, "MMM").toLowerCase() as any)}</div>
				<div>{format(time, "d, yyyy").toLowerCase()}</div>|
				<div>{format(time, "pp")}</div>
			</h1>

			<div className="flex items-end gap-3 ">
				<span className="text-sm capitalize">
					{t(format(time, "EEEE").toLowerCase() as any)}
				</span>
			</div>
		</div>
	);
}
