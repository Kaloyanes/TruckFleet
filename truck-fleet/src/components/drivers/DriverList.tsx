"use client";
import { db } from "@/firebase/firebase";
import useCompanyId from "@/hooks/useCompanyId";
import { collection, query, where } from "firebase/firestore";
import React from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Button } from "../ui/button";
import type { Order } from "@/models/orders";
import { ScrollArea } from "../ui/scroll-area";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import {
	useReactTable,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	flexRender,
} from "@tanstack/react-table";
import { Table } from "lucide-react";
import { ScrollBar } from "../ui/scroll-area";
import {
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "../ui/table";
import { DriverColumns } from "./drivers-table/DriverColumns";
import { driverConverter } from "@/firebase/converters/driverConverter";
import DriverDataTable from "./drivers-table/DriverDataTable";

export default function DriverList() {
	const { companyId } = useCompanyId();

	const [drivers, loading, error] = useCollectionData(
		query(
			collection(db, "users"),
			where("type", "==", "driver"),
			where("companyId", "==", companyId),
		).withConverter(driverConverter),
	);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;
	if (!drivers) return <div>No drivers found</div>;

	return <DriverDataTable columns={DriverColumns} data={drivers} />;
}
