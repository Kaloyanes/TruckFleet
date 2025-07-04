"use client";
import { Spinner } from "@/components/ui/loading-spinner";
import { db } from "@/lib/Firebase";
import useCompanyId from "@/hooks/useCompanyId";
import { collection, orderBy, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { EmployeeColumns } from "./drivers-table/DriverColumns";
import EmployeeGridTable from "./drivers-table/DriverDataTable";
import { DriverConverter } from "@/lib/converters/DriverConverter";

export default function DriverList() {
	const { companyId } = useCompanyId();

	const [drivers, loading, error] = useCollectionData(
		query(
			collection(db, "users"),
			orderBy("type"),
			where("companyId", "==", companyId),
		).withConverter(DriverConverter),
	);

	if (loading) return <Spinner />;
	if (error) return <div>Error: {error.message}</div>;
	if (!drivers) return <div />;

	return <EmployeeGridTable columns={EmployeeColumns} data={drivers} />;
}
