import { View } from "react-native";
import React from "react";
import { Text } from "~/components/ui/text";
import { Area, CartesianChart, Line } from "victory-native";

import { useColorScheme } from "~/lib/useColorScheme";
import { vec, LinearGradient } from "@shopify/react-native-skia";

const data = Array.from({ length: 15 }, (_, index) => ({
	day: index + 1,
	km: Math.random() * 100 + 1,
}));

export default function KmChart() {
	const { isDarkColorScheme } = useColorScheme();

	return (
		<View className="flex-1 h-[300px]">
			<CartesianChart
				data={data}
				xKey="day"
				yKeys={["km"]}
				padding={{
					bottom: 20,
					top: 10,
					left: -5,
				}}
				axisOptions={{
					lineWidth: 0,
				}}
				frame={{
					lineWidth: 0,
				}}
				domainPadding={{ top: 30, bottom: 30 }}
			>
				{({ points, chartBounds }) => (
					<>
						<Line
							connectMissingData
							points={points.km}
							color={isDarkColorScheme ? "#fff" : "#000"}
							curveType="natural"
							strokeWidth={2}
							animate={{ type: "spring", duration: 600 }}
						/>
						<Area
							connectMissingData
							y0={chartBounds.bottom}
							points={points.km}
							curveType="natural"
							animate={{ type: "spring", duration: 600 }}
						>
							<LinearGradient
								start={vec(chartBounds.bottom, 200)}
								end={vec(chartBounds.bottom, chartBounds.bottom)}
								colors={
									isDarkColorScheme
										? ["rgba(255,255,255,0.1)", "rgba(255,255,255,0)"]
										: ["rgba(0,0,0,0.1)", "rgba(0,0,0,0)"]
								}
							/>
						</Area>
					</>
				)}
			</CartesianChart>
		</View>
	);
}
