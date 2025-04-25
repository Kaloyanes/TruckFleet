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
import { useState } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { IconMessage, IconPhone } from "@tabler/icons-react";
import router from "next/router";
import { toast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";

export default function TruckMap() {
	const { companyId } = useCompanyId();
	const [orders, loading, error] = useCollectionData(
		query(
			collection(db, "orders"),
			where("companyId", "==", companyId),
			orderBy("createdAt", "desc"),
		).withConverter(OrderConverter),
	);
	const t = useTranslations("DriverActions");

	const [users, loadingUsers, errorUsers] = useCollectionData(
		query(collection(db, "users"), where("companyId", "==", companyId)),
	);

	const { resolvedTheme } = useTheme();
	const mapId =
		resolvedTheme === "dark" ? "71b489216afed105" : "41fca17a46fdb39e";

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
			reuseMaps
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

			{users.map((user) => {
				if (user.location === undefined) return <></>;
				async function createChat() {
					if (!user) {
						toast({
							title: t("chatCreationFailed"),
							variant: "destructive",
						});
						return;
					}

					const userIds = [user.uid, auth.currentUser?.uid].sort();

					const chatQuery = query(
						collection(db, "chats"),
						where("participants", "array-contains", user.uid),
					);

					const chatSnapshot = await getDocs(chatQuery);

					if (!chatSnapshot.empty) {
						for (const doc of chatSnapshot.docs) {
							const chat = doc.data();

							if (!chat.participants.includes(user.uid)) {
								continue;
							}

							router.push(`/dashboard/chat/${doc.id}`);
							return;
						}
					}

					const chatValues = {
						createdAt: new Date(),
						lastMessagedAt: new Date(),
						participants: userIds,
					};
					const chatRef = await addDoc(collection(db, "chats"), chatValues);

					router.push(`/dashboard/chat/${chatRef.id}`);
				}
				return (
					<Popover key={user.id}>
						<PopoverTrigger asChild>
							<AdvancedMarker
								position={{
									lat: user.location.latitude,
									lng: user.location.longitude,
								}}
								className="relative cursor-pointer"
							>
								<div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-7 w-7 rounded-full bg-chart-1/30" />
								<div
									className="flex aspect-square h-5 w-5 items-center justify-center rounded-full bg-chart-1 transition-all duration-300"
									style={{
										transform: `rotate(${Math.round(user.location.heading)}deg)`,
									}}
								/>
							</AdvancedMarker>
						</PopoverTrigger>
						<PopoverContent className="flex w-auto flex-col items-start justify-center text-sm">
							<div className="flex items-center justify-between gap-6">
								<p className="font-semibold">{user.name ?? "Unnamed User"}</p>
								<Button
									variant="ghost"
									size="icon"
									className="size-5"
									onClick={createChat}
								>
									<IconMessage />
								</Button>
							</div>
							<p className="text-muted-foreground">{user.email}</p>
							<p className="text-muted-foreground">{user.phone}</p>
						</PopoverContent>
					</Popover>
				);
			})}
		</GoogleMap>
	);
}
