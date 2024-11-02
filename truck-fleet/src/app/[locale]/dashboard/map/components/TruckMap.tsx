"use client";

import { Spinner } from "@/components/ui/loading-spinner";
import { orderConverter } from "@/firebase/converters/orderConverter";
import { db } from "@/firebase/firebase";
import useCompanyId from "@/hooks/useCompanyId";
// import {
// 	AdvancedMarker,
// 	Map as GoogleMap,
// 	Marker,
// 	RenderingType,
// } from "@vis.gl/react-google-maps";
import { collection, orderBy, query, where } from "firebase/firestore";
import { useTheme } from "next-themes";
import { useCollectionData } from "react-firebase-hooks/firestore";
import TruckDirections from "./TruckDirections";
import { Map as BoxMap, Marker, NavigationControl, useMap } from "react-map-gl";
import { IconPin } from "@tabler/icons-react";

import "mapbox-gl/dist/mapbox-gl.css";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function TruckMap() {
	const { companyId } = useCompanyId();
	const [orders, loading, error] = useCollectionData(
		query(
			collection(db, "orders"),
			where("companyId", "==", companyId),
			orderBy("createdAt", "desc"),
		).withConverter(orderConverter),
	);

	const [users, loadingUsers, errorUsers] = useCollectionData(
		query(collection(db, "users"), where("companyId", "==", companyId)),
	);

	const { resolvedTheme } = useTheme();
	const mapId =
		resolvedTheme === "dark" ? "71b489216afed105" : "41fca17a46fdb39e";

	const mapStyle =
		resolvedTheme === "dark"
			? "mapbox://styles/kaloyanes/cm300spo900uu01o07k3ih0zx"
			: "mapbox://styles/kaloyanes/cm301wcen009401qt8q3l9mbh";

	const map = useMap();

	if (loading || loadingUsers) return <Spinner />;
	if (error || errorUsers)
		return (
			<div>Error fetching orders {error?.message ?? errorUsers?.message}</div>
		);

	if (orders === undefined || users === undefined) return <div />;

	return (
		<BoxMap
			style={{ width: "100%", height: "100%", overflow: "hidden" }}
			mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
			initialViewState={{
				zoom: 5,
			}}
			mapStyle={mapStyle}
			bearingSnap={90}
		>
			{users.map((user, index) => {
				if (user.location === undefined) return <></>;
				console.log(user.location);

				if (index === users.length - 1) {
					map.current?.flyTo({
						center: [user.location.longitude, user.location.latitude],
						zoom: 15,
						speed: 1,
						curve: 1,
						easing: (t) => t,
					});
				}
				return (
					<Marker
						key={user.id + Math.random().toString()}
						latitude={user.location.latitude}
						longitude={user.location.longitude}
						anchor="center"
					>
						<div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-7 w-7 rounded-full bg-chart-1/30" />
						<motion.div
							animate={{ scale: [1, 1.2, 1] }}
							transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
							className="flex aspect-square h-5 w-5 items-center justify-center rounded-full bg-chart-1 transition-all duration-300"
							style={{
								transform: `rotate(${Math.round(user.location.heading)}deg)`,
							}}
						/>
					</Marker>
				);
			})}
			<NavigationControl
				showZoom={false}
				visualizePitch={true}
				style={{
					backgroundColor: "rgba(0, 0, 0, 0.5)",
				}}
			/>
		</BoxMap>
	);

	// return (
	// 	<>
	// 		<GoogleMap
	// 			mapId={mapId}
	// 			backgroundColor={"#0a0a0a"}
	// 			style={{ width: "100%", height: "100%", outline: "none" }}
	// 			defaultCenter={{ lat: 22.54992, lng: 0 }}
	// 			defaultZoom={3}
	// 			minZoom={3}
	// 			gestureHandling={"greedy"}
	// 			disableDefaultUI={true}
	// 			reuseMaps
	// 			renderingType={RenderingType.VECTOR}
	// 		>
	// 			{orders?.map((order) => {
	// 				const waypoints = [];

	// 				if (order.pickUps.length > 1) {
	// 					waypoints.push(
	// 						...order.pickUps.slice(1).map((location) => {
	// 							return {
	// 								location: location.address,
	// 							};
	// 						}),
	// 					);
	// 				}

	// 				if (order.deliveries.length > 1) {
	// 					waypoints.push(
	// 						...order.deliveries
	// 							.slice(0, order.deliveries.length - 2)
	// 							.map((location) => {
	// 								return {
	// 									location: location.address,
	// 								};
	// 							}),
	// 					);
	// 				}

	// 				return (
	// 					<TruckDirections
	// 						key={order.id}
	// 						originAddress={order.pickUps[0].address}
	// 						destinationAddress={
	// 							order.deliveries[order.deliveries.length - 1].address
	// 						}
	// 						waypoints={waypoints.length > 0 ? waypoints : undefined}
	// 					/>
	// 				);
	// 			})}

	// 			<Marker position={{ lat: 53.54992, lng: 10.00678 }} />

	// 			{users.map((user) => {
	// 				if (user.location === undefined) return <></>;
	// 				console.log(user.location);

	// 				return (
	// 					<AdvancedMarker
	// 						key={user.id + Math.random().toString()}
	// 						position={{
	// 							lat: user.location.latitude,
	// 							lng: user.location.longitude,
	// 						}}
	// 						className="relative"
	// 					>
	// 						<div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-7 w-7 rounded-full bg-chart-1/30" />
	// 						<div
	// 							className="flex aspect-square h-5 w-5 items-center justify-center rounded-full bg-chart-1 transition-all duration-300"
	// 							style={{
	// 								transform: `rotate(${Math.round(user.location.heading)}deg)`,
	// 							}}
	// 						/>
	// 						{/* <IconNavigation /> */}
	// 					</AdvancedMarker>
	// 				);
	// 			})}
	// 		</GoogleMap>
	// 	</>
	// );
}
