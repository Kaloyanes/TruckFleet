"use client";

import { Spinner } from "@/components/ui/loading-spinner";
import { auth, db } from "@/lib/Firebase";
import useCompanyId from "@/hooks/useCompanyId";
import {
	AdvancedMarker,
	Map as GoogleMap,
	Marker,
	RenderingType,
} from "@vis.gl/react-google-maps";
import {
	addDoc,
	collection,
	getDocs,
	orderBy,
	query,
	where,
} from "firebase/firestore";
import { useTheme } from "next-themes";
import { useCollectionData } from "react-firebase-hooks/firestore";
import TruckDirections from "./TruckDirections";
import { OrderConverter } from "@/lib/converters/OrderConverter";
import { useEffect, useState } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { IconMessage, IconPhone } from "@tabler/icons-react";
import { useRouter } from "@/i18n/routing"; // Import useRouter
import { toast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import { useAuthState } from "react-firebase-hooks/auth"; // Import useAuthState
import { useChatStore } from "@/stores/Chats/ChatStore"; // Import the chat store
import { DriverConverter } from "@/lib/converters/DriverConverter";
import UserPin from "./UserPin";

export default function TruckMap() {
	const { companyId } = useCompanyId();
	const [orders, loading, error] = useCollectionData(
		query(
			collection(db, "orders"),
			where("companyId", "==", companyId),
			orderBy("createdAt", "desc"),
		).withConverter(OrderConverter),
	);
	const router = useRouter(); // Instantiate useRouter
	const [currentUser, currentUserLoading] = useAuthState(auth); // Get current user

	const [users, loadingUsers, errorUsers] = useCollectionData(
		query(
			collection(db, "users"),
			where("companyId", "==", companyId),
		).withConverter(DriverConverter),
	);

	const { resolvedTheme } = useTheme();
	const mapId =
		resolvedTheme === "dark" ? "71b489216afed105" : "41fca17a46fdb39e";

	useEffect(() => {
		console.log(users);
	}, [users]);

	if (loading || loadingUsers) return <Spinner />;
	if (error || errorUsers)
		return (
			<div>Error fetching orders {error?.message ?? errorUsers?.message}</div>
		);

	if (orders === undefined || users === undefined) return <div />;

	return (
		<GoogleMap
			key={mapId}
			mapId={mapId}
			backgroundColor={"#0a0a0a"}
			style={{ width: "100%", height: "100%", outline: "none !important" }}
			defaultCenter={{ lat: 22.54992, lng: 0 }}
			defaultZoom={3}
			minZoom={3}
			gestureHandling={"greedy"}
			disableDefaultUI={true}
			clickableIcons={false} // Add this line
			reuseMaps
			renderingType={RenderingType.VECTOR}
			noClear={false}
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

			{users.map((user, index) => {
				if (user.location === undefined) return <div key={user.id} />;

				return (
					<UserPin
						key={user.id}
						user={user}
						currentUser={currentUser}
						currentUserLoading={currentUserLoading}
						index={index}
					/>
				);
			})}
		</GoogleMap>
	);
}
