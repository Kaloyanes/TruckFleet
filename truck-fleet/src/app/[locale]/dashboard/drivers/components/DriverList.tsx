"use client";
import { driverConverter } from "@/firebase/converters/driverConverter";
import { db } from "@/firebase/firebase";
import useCompanyId from "@/hooks/useCompanyId";
import { collection, orderBy, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { DriverColumns } from "./drivers-table/DriverColumns";
import DriverDataTable from "./drivers-table/DriverDataTable";

export default function DriverList() {
	const { companyId } = useCompanyId();

	const [drivers, loading, error] = useCollectionData(
		query(
			collection(db, "users"),
			orderBy("type"),
			where("companyId", "==", companyId),
		).withConverter(driverConverter),
	);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;
	if (!drivers) return <div />;

	return <DriverDataTable columns={DriverColumns} data={drivers} />;
}
