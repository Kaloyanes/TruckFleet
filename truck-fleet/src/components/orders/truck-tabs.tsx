"use client";
import React, { useEffect, useState } from "react";
import AnimatedBackground from "../ui/animated-background";
// import { usePathname, useRouter } from "next/navigation";

import { Link, usePathname, useRouter } from "@/lib/navigation";
import {
	useCollection,
	useCollectionData,
} from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import useCompanyId from "@/hooks/useCompanyId";

export default function TruckTabs() {
	const router = useRouter();
	const pathName = usePathname();
	const [Tabs, setTabs] = useState([""]);

	const companyId = useCompanyId();

	const [values, loading, error, snapshot] = useCollectionData<any>(
		query(collection(db, "trucks"), where("companyId", "==", companyId)),
		{},
	);

	useEffect(() => {
		setTabs(values?.map((truck) => truck.licensePlate) || []);
		router.replace(`/dashboard/orders/${values?.[0]?.licensePlate}`);
	}, [values]);

	const [currentSelectedTab, setCurrentTab] = useState(Tabs[0]);

	useEffect(() => {
		setCurrentTab(Tabs.find((tab) => pathName.includes(tab)) || Tabs[0]);
	}, [pathName, Tabs]);

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
