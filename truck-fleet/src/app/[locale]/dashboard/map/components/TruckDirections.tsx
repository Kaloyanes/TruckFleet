"use client";
import { getCssVariableValue } from "@/lib/utils";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

export default function TruckDirections({
	originAddress,
	destinationAddress,
	waypoints,
}: {
	originAddress: string;
	destinationAddress: string;
	waypoints?: google.maps.DirectionsWaypoint[] | undefined;
}) {
	useEffect(() => {
		console.log(originAddress, destinationAddress, waypoints);
	}, [destinationAddress, originAddress, waypoints]);

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

		const pathColor = getCssVariableValue("--chart-4");
		const circleColor = getCssVariableValue("--chart-5");
		console.log("cssVar", pathColor);
		setDirectionsRenderer(
			new routesLibrary.DirectionsRenderer({
				map,
				polylineOptions: {
					strokeColor: `hsl(${pathColor})`,
				},
				markerOptions: {
					optimized: true,
					animation: google.maps.Animation.DROP,
					icon: {
						fillColor: `hsl(${circleColor})`,
						fillOpacity: 1,
						strokeColor: `hsl(${circleColor})`,
						path: google.maps.SymbolPath.CIRCLE,
						scale: 7,
					},
				},
			}),
		);
	}, [routesLibrary, map]);

	const locale = useLocale();

	useEffect(() => {
		if (!directionsService || !directionsRenderer) return;

		directionsService
			.route({
				origin: originAddress,
				destination: destinationAddress,
				travelMode: google.maps.TravelMode.DRIVING,
				provideRouteAlternatives: false,
				avoidHighways: false,
				language: locale,
				// waypoints: waypoints,
			})
			.then((response) => {
				directionsRenderer.setDirections(response);
				setRoutes(response.routes);
			});

		return () => directionsRenderer.setMap(null);
	}, [
		directionsService,
		directionsRenderer,
		destinationAddress,
		locale,
		originAddress,
	]);

	// Update direction route
	useEffect(() => {
		if (!directionsRenderer) return;
		directionsRenderer.setRouteIndex(routeIndex);
	}, [routeIndex, directionsRenderer]);

	if (!leg) return null;

	return <></>;
}
