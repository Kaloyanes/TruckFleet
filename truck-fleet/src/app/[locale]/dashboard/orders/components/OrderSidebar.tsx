"use client";
import { Spinner } from "@/components/ui/loading-spinner";
import { OrderSelectedContext } from "@/context/orders/order-selected-context";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useContext, useEffect, useState } from "react";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";

export default function OrderSidebar() {
	const orderSelectedContext = useContext(OrderSelectedContext);
	const order = orderSelectedContext?.order;

	const show = orderSelectedContext?.order !== null;

	const [driver, loading, error] = useDocumentDataOnce(
		orderSelectedContext?.order?.driver,
	);

	if (loading) return <Spinner />;
	if (error) return <div>Error fetching driver {error.message}</div>;
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
