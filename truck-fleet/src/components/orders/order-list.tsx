"use client";
import React, { useEffect, useState } from "react";
import useCompanyId from "@/hooks/useCompanyId";
import {
	collection,
	doc,
	type DocumentData,
	type FirestoreDataConverter,
	orderBy,
	query,
	Timestamp,
	where,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "@/firebase/firebase";
import { columns } from "./order-table/columns";
import OrderDataTable from "./order-table/data-table";
import type { Order } from "@/models/orders";
import { orderConverter } from "@/firebase/converters/orderConverter";

export default function OrderList({ truckId }: { truckId: string }) {
	const companyId = useCompanyId();
	const [orders, loading, error] = useCollectionData(
		query(
			collection(db, "orders"),
			where("companyId", "==", companyId),
			where("licensePlate", "==", truckId),
			orderBy("createdAt", "desc"),
		).withConverter(orderConverter),
	);

	if (loading) return <div className="w-full" />;
	if (error) {
		console.error("Firebase ERROR", error.message);
		return <div>Error fetching orders {error.message}</div>;
	}
	if (orders === undefined) return <div>No orders found</div>;

	return <OrderDataTable columns={columns} data={orders} />;
}
