"use client";
import React, { useEffect, useState } from "react";
import { useOrderIdContext } from "@/context/order-selected-context";
import useCompanyId from "@/hooks/useCompanyId";
import {
	collection,
	doc,
	type DocumentData,
	type FirestoreDataConverter,
	orderBy,
	query,
	where,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "@/firebase/firebase";
import { columns } from "./order-table/columns";
import OrderDataTable from "./order-table/data-table";
import type { Order } from "@/models/orders";

const orderConverter: FirestoreDataConverter<Order> = {
	toFirestore(order: Order): DocumentData {
		const {
			status,
			driver,
			truck,
			company,
			palletes,
			pickUps,
			deliveries,
			documents,
			note,
			companyId,
		} = order;
		return {
			companyId,
			status,
			driver: driver ? driver.path : null,
			truck: truck ? truck.path : null,
			company: {
				ref: company.ref.path,
				name: company.name,
				worker: company.worker,
			},
			palletes,
			pickUps,
			deliveries,
			documents,
			note,
		};
	},

	fromFirestore(snapshot, options): Order {
		const data = snapshot.data(options);
		const {
			status,
			driver,
			truck,
			company,
			palletes,
			pickUps,
			deliveries,
			documents,
			note,
			companyId,
		} = data;
		return {
			companyId,
			status,
			driver: driver ? doc(db, driver) : undefined,
			truck: truck ? doc(db, truck) : undefined,
			company: {
				ref: doc(db, company.ref),
				name: company.name,
				worker: company.worker,
			},
			palletes,
			pickUps,
			deliveries,
			documents: documents as { name: string; url: string },
			note,
		};
	},
};

export default function OrderList({ truckId }: { truckId: string }) {
	const companyId = useCompanyId();
	const [orders, loading, error] = useCollectionData(
		query(
			collection(db, "orders"),
			where("licensePlate", "==", truckId),
			where("companyId", "==", companyId),
			orderBy("createdAt", "desc"),
		).withConverter(orderConverter),
	);

	if (loading) return <div className="w-full" />;
	if (error) {
		console.error(error);
		return <div>Error fetching orders</div>;
	}
	if (orders === undefined) return <div>No orders found</div>;

	return <OrderDataTable columns={columns} data={orders} />;
}
