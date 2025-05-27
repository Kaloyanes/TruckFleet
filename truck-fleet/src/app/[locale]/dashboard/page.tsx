"use client";
import SignOutButton from "@/app/[locale]/dashboard/components/SignOutButton";
import OrderCharts from "./components/OrderCharts";
import TrucksExpenses from "./components/TrucksExpenses";
import useProfileDoc from "@/hooks/useProfileDoc";

export default function DashboardPage() {
	const { profile, loading, profilePromise } = useProfileDoc();

	return (
		<div className="mx-5 mt-4 h-full w-full space-y-4">
			<h1 className="font-semibold text-4xl">
				<span className="font-normal">Welcome</span>
				{profile && <span className="font-bold">, {profile?.name}</span>}
			</h1>
			<div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{/* <OrderCharts /> */}
				<TrucksExpenses />
				{/* <TrucksExpenses /> */}
				{/* <TrucksExpenses /> */}
				{/* <OrderCharts /> */}
				{/* <OrderCharts /> */}
				{/* <TrucksExpenses /> */}
				{/* <OrderCharts /> */}
			</div>
		</div>
	);
}
