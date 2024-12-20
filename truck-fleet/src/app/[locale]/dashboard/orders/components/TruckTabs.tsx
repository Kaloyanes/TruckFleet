"use client";
import { useEffect, useState } from "react";
// import { usePathname, useRouter } from "next/navigation";

import AnimatedTabs from "@/components/AnimatedTabs";
import useCompanyId from "@/hooks/useCompanyId";
import { db } from "@/lib/Firebase";
import { usePathname, useRouter } from "@/i18n/routing";
import { collection, query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

export default function TruckTabs() {
	const router = useRouter();
	const pathName = usePathname();
	const [tabs, setTabs] = useState([""]);

	const { companyId } = useCompanyId();

	const [values, loading, error, snapshot] = useCollectionData<any>(
		query(collection(db, `companies/${companyId}/trucks`)),
		{},
	);

	useEffect(() => {
		if (values === undefined || values.length === 0 || loading) return;

		setTabs(values?.map((truck) => truck.licensePlate) || []);

		if (pathName === "/dashboard/orders")
			router.replace(`/dashboard/orders/${values?.[0]?.licensePlate}`);
	}, [values, loading, pathName, router.replace]);

	const [currentSelectedTab, setCurrentTab] = useState(tabs[0]);

	useEffect(() => {
		setCurrentTab(tabs.find((tab) => pathName.includes(tab)) || tabs[0]);
	}, [pathName, tabs]);

	return (
		<div className="flex h-10 flex-row gap-2">
			<AnimatedTabs
				tabs={tabs.map((tab) => ({
					label: tab,
					value: `/dashboard/orders/${tab}`,
				}))}
			/>
		</div>
	);
}
