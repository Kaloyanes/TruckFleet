"use client";

import React, { useEffect, useState } from "react";
import {
	AdvancedMarker,
	ControlPosition,
	Map as GoogleMap,
	InfoWindow,
	MapControl,
	Pin,
	RenderingType,
} from "@vis.gl/react-google-maps";
import {
	IconCircle,
	IconCircleFilled,
	IconMapPinFilled,
	IconPinFilled,
} from "@tabler/icons-react";
import TruckDirections from "./TruckDirections";
import { useTheme } from "next-themes";
import useCompanyId from "@/hooks/useCompanyId";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { orderConverter } from "@/firebase/converters/orderConverter";
import { db } from "@/firebase/firebase";
import { query, collection, where, orderBy } from "firebase/firestore";

export default function TruckMap() {
	const { resolvedTheme } = useTheme();

	const { companyId } = useCompanyId();
	const [orders, loading, error] = useCollectionData(
		query(
			collection(db, "orders"),
			where("companyId", "==", companyId),
			orderBy("createdAt", "desc"),
		).withConverter(orderConverter),
	);

	const mapId =
		resolvedTheme === "dark" ? "71b489216afed105" : "41fca17a46fdb39e";

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error fetching orders {error.message}</div>;

	if (orders === undefined) return <div />;

	return (
		<>
			<GoogleMap
				mapId={mapId}
				style={{ width: "100%", height: "100%", outline: "none" }}
				defaultCenter={{ lat: 22.54992, lng: 0 }}
				defaultZoom={3}
				minZoom={3}
				gestureHandling={"greedy"}
				disableDefaultUI={true}
				renderingType={RenderingType.VECTOR}
			>
				{orders?.map((order) => {
					const waypoints = [];

					if (order.pickUps.length > 1) {
						waypoints.push(
							...order.pickUps.slice(1).map((location) => {
								return {
									location: location.address,
								};
							}),
						);
					}

					if (order.deliveries.length > 1) {
						waypoints.push(
							...order.deliveries
								.slice(0, order.deliveries.length - 2)
								.map((location) => {
									return {
										location: location.address,
									};
								}),
						);
					}

					return (
						<TruckDirections
							key={order.id}
							originAddress={order.pickUps[0].address}
							destinationAddress={
								order.deliveries[order.deliveries.length - 1].address
							}
							waypoints={waypoints.length > 0 ? waypoints : undefined}
						/>
					);
				})}
			</GoogleMap>
		</>
	);
}
