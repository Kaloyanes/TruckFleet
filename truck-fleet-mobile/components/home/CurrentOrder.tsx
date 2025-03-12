import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { Text } from "../ui/text";
import { Card, CardHeader } from "../ui/card";

export default function CurrentOrder() {
	const [order, setOrder] = useState(null);

	useEffect(() => {
		(async () => {
			// Fetch order
		})();
	}, []);

	return (
		<View className="flex-1 items-center justify-center px-5">
			<Card className="flex-1 w-full ">
				<CardHeader>
					<Text className="text-xl">Current Order</Text>
				</CardHeader>
			</Card>
		</View>
	);
}
