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
import { db } from "@/lib/Firebase";
import type { Order } from "@/types/orders";
import { OrderColumns } from "./order-table/OrderColumns";
import OrderDataTable from "./order-table/OrderDataTable";
import { OrderConverter } from "@/lib/converters/OrderConverter";

export default function OrderList({ truckId }: { truckId: string }) {
	const { companyId } = useCompanyId();
	const [orders, loading, error] = useCollectionData(
		companyId
			? query(
					collection(db, `companies/${companyId}/orders`),
					where("licensePlate", "==", truckId),
					orderBy("createdAt", "desc"),
				).withConverter(OrderConverter)
			: null,
	);

	if (loading) return <div className="w-full" />;
	if (error) {
		console.error("Firebase ERROR", error.message);
		return <div>Error fetching orders {error.message}</div>;
	}
	if (orders === undefined) return <div />;

	return <OrderDataTable columns={OrderColumns} data={orders} />;
}
