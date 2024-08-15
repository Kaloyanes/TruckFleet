"use client";
import React, { useEffect, useState } from "react";
import { useOrderIdContext } from "@/context/order-selected-context";
import useCompanyId from "@/hooks/useCompanyId";
import {
	collection,
	type DocumentData,
	type FirestoreDataConverter,
	orderBy,
	query,
	where,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "@/firebase/firebase";
import { columns, type Order } from "./order-table/columns";
import OrderDataTable from "./order-table/data-table";

const orderConverter: FirestoreDataConverter<Order> = {
	toFirestore(order: Order): DocumentData {
		return {
			companyId: order.companyId,
			companyOrderId: order.companyOrderId,
			createdAt: order.createdAt,
			customerCompanyId: order.customerCompanyId,
			customerCompanyRef: order.customerCompanyRef,
			documents: order.documents,
			driver: order.driver,
			driverId: order.driverId,
			isDone: order.isDone,
			licensePlate: order.licensePlate,
			locations: order.locations,
			note: order.note,
			orderId: order.orderId,
			orderSize: order.orderSize,
			orderSum: order.orderSum,
			status: order.status,
			truckRef: order.truckRef,
			weight: order.weight,
			worker: order.worker,
		};
	},
	fromFirestore(snapshot: DocumentData): Order {
		const data = snapshot.data();
		return {
			id: snapshot.id,
			companyId: data.companyId,
			companyOrderId: data.companyOrderId,
			createdAt: data.createdAt,
			customerCompanyId: data.customerCompanyId,
			customerCompanyRef: data.customerCompanyRef,
			documents: data.documents,
			driver: data.driver,
			driverId: data.driverId,
			isDone: data.isDone,
			licensePlate: data.licensePlate,
			locations: data.locations,
			note: data.note,
			orderId: data.orderId,
			orderSize: data.orderSize,
			orderSum: data.orderSum,
			status: data.status,
			truckRef: data.truckRef,
			weight: data.weight,
			worker: data.worker,
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
