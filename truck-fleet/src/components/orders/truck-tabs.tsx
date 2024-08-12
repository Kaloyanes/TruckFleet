"use client";
import React, { useEffect, useState } from "react";
import AnimatedBackground from "../ui/animated-background";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function TruckTabs() {
	const router = useRouter();
	const pathName = usePathname();
	const Tabs = ["All", "A9015H", "A9015B", "Services", "Contact"];
	const [currentSelectedTab, setCurrentTab] = useState(Tabs[0]);

	useEffect(() => {
		setCurrentTab(Tabs.find((tab) => pathName.includes(tab)) || Tabs[0]);
	}, [pathName]);

	return (
		<div className="flex flex-row gap-2 h-10">
			<AnimatedBackground
				defaultValue={Tabs[0]}
				className="rounded-lg bg-neutral-200 dark:bg-neutral-800"
				transition={{
					type: "spring",
					bounce: 0.2,
					duration: 0.3,
				}}
				enableHover
			>
				{Tabs.map((tab, index) => (
					<Link
						key={index}
						data-id={tab}
						type="button"
						href={`/dashboard/orders/${tab !== "All" ? tab : ""}`}
						className={`px-2 py-0.5 text-neutral-700 transition-colors duration-300 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50 flex flex-col justify-center items-center ${tab === currentSelectedTab ? "bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-300 text-neutral-900" : ""} rounded-lg`}
					>
						{tab}
					</Link>
				))}
			</AnimatedBackground>
		</div>
	);
}
