"use client";
import React, { useEffect } from "react";
import { useTruckStore } from "@/stores/Trucks/TrucksStore";
import useCompanyId from "@/hooks/useCompanyId";
import TruckDataTable from "./components/trucks-table/TruckDataTable";
import { TruckColumns } from "./components/trucks-table/TruckColumns";

export default function TrucksPage() {
	const { trucks, loadTrucks } = useTruckStore();
	const companyId = useCompanyId();

	useEffect(() => {
		let unsubscribe: () => void = () => {};
		if (companyId.companyId) {
			unsubscribe = loadTrucks(companyId.companyId);
		}
		return () => unsubscribe();
	}, [loadTrucks, companyId]);

	return (
		<div className="">
			{/* Render the trucks in a table similar to drivers */}
			<TruckDataTable columns={TruckColumns} data={trucks} />
		</div>
	);
}
