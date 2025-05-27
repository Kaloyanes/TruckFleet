import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { Text } from "../ui/text";
import { Card, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { router } from "expo-router";
import { trigger } from "react-native-haptic-feedback";

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
				<CardFooter>
					<Button
						variant={"link"}
						className="!p-0"
						onPress={() => {
							router.push("/(tabs)/orders/");
						}}
					>
						<Text>See All Orders</Text>
					</Button>
				</CardFooter>
			</Card>
		</View>
	);
}
