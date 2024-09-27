"use client";
import { OrderSelectedContext } from "@/context/orders/order-selected-context";
import { IconMessage, IconPhone, IconX } from "@tabler/icons-react";
import {
	APIProvider,
	Map as GoogleMap,
	useMap,
	useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { AnimatePresence, motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "../../../../../components/ui/avatar";
import { Button } from "../../../../../components/ui/button";
import {
	CardContent,
	CardHeader,
	CardTitle,
} from "../../../../../components/ui/card";

export default function OrderSidebar() {
	const orderSelectedContext = useContext(OrderSelectedContext);
	const order = orderSelectedContext?.order;

	const show = orderSelectedContext?.order !== null;

	const [driver, loading, error] = useDocumentDataOnce(
		orderSelectedContext?.order?.driver,
	);

	return (
		<AnimatePresence>
			{show && (
				<motion.div
					initial={{ width: 0 }}
					animate={{ width: "500px" }}
					exit={{ width: 0 }}
					transition={{ duration: 0.3, ease: "circOut" }}
					className={`min-w-0 border-border overflow-hidden w-[500px] rounded-l-none    rounded-lg bg-background/50  backdrop-saturate-150  ${show ? "rounded-full border" : "rounded-none border-0"} `}
				>
					<CardHeader className="flex justify-between flex-row items-center">
						<CardTitle className="min-w-[400px]">
							Order Details #{order?.id}
						</CardTitle>
						<Button
							className=""
							variant={"ghost"}
							size={"icon"}
							onClick={() => {
								orderSelectedContext?.setOrder(null);
							}}
						>
							<IconX />
						</Button>
					</CardHeader>
					<CardContent className="min-w-[500px] flex flex-col">
						<div className="w-full h-full flex gap-4 items-center justify-between">
							<div className="flex gap-4 items-center">
								<Avatar>
									<AvatarImage src={driver?.photoUrl} alt={driver?.name} />
									<AvatarFallback>
										{(driver?.name as string)
											?.split(" ")
											.map((name) => name[0])
											.join("")}
									</AvatarFallback>
								</Avatar>
								<div className="flex flex-col">
									<h2 className="text-lg font-semibold">{driver?.name}</h2>
									<p className="text-sm">{driver?.email}</p>
								</div>
							</div>
							<div className="flex gap-2 self-end">
								<Button variant={"outline"} size={"icon"}>
									<IconPhone />
								</Button>
								<Button variant={"outline"} size={"icon"}>
									<IconMessage />
								</Button>
							</div>
						</div>
						<div className="py-10 rounded-lg h-full flex-1">
							<APIProvider
								apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
							>
								<GoogleMap
									style={{ width: "100%", height: "50vh" }}
									defaultCenter={{ lat: 22.54992, lng: 0 }}
									defaultZoom={3}
									gestureHandling={"greedy"}
									disableDefaultUI={true}
									reuseMaps
								>
									<Directions />
								</GoogleMap>
							</APIProvider>
						</div>
					</CardContent>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

function Directions() {
	const map = useMap();
	const routesLibrary = useMapsLibrary("routes");
	const [directionsService, setDirectionsService] =
		useState<google.maps.DirectionsService>();
	const [directionsRenderer, setDirectionsRenderer] =
		useState<google.maps.DirectionsRenderer>();
	const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
	const [routeIndex, setRouteIndex] = useState(0);
	const selected = routes[routeIndex];
	const leg = selected?.legs[0];

	// Initialize directions service and renderer
	useEffect(() => {
		if (!routesLibrary || !map) return;
		setDirectionsService(new routesLibrary.DirectionsService());
		setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
	}, [routesLibrary, map]);

	// Use directions service
	useEffect(() => {
		if (!directionsService || !directionsRenderer) return;

		directionsService
			.route({
				origin: "зорница к-с Перла бл.2 вх.2, Бургас",
				destination: "ул. Недялко Месечкове 62, Ямбол",
				travelMode: google.maps.TravelMode.DRIVING,
				provideRouteAlternatives: true,
			})
			.then((response) => {
				directionsRenderer.setDirections(response);
				setRoutes(response.routes);
			});

		return () => directionsRenderer.setMap(null);
	}, [directionsService, directionsRenderer]);

	// Update direction route
	useEffect(() => {
		if (!directionsRenderer) return;
		directionsRenderer.setRouteIndex(routeIndex);
	}, [routeIndex, directionsRenderer]);

	if (!leg) return null;

	return null;
}
