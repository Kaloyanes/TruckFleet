import { View, Text } from "react-native";
import React from "react";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import { Button } from "~/components/ui/button";
import { IconPlus } from "@tabler/icons-react-native";
import * as DropdownMenu from "zeego/dropdown-menu";
import { useMessageStore } from "~/stores/message-store";

export default function ChatInputMore({
	isDarkColorScheme,
}: { isDarkColorScheme: boolean }) {
	const { sendPhoto, sendFile } = useMessageStore();

	const actions = [
		{
			title: "Gallery",
			ios: "photo",
			onSelect: () => {
				sendPhoto("image");
			},
		},
		{
			title: "Camera",
			ios: "camera",
			onSelect: () => {
				sendPhoto("camera");
			},
		},
		{
			title: "File",
			ios: "document",
			onSelect: () => {
				sendFile();
			},
		},
		{
			title: "Location",
			ios: "location",
			onSelect: () => {
				console.log("location");
			},
		},
	];
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				<MotiView
					from={{
						width: 0,
						translateX: -50,
						marginHorizontal: 0,
					}}
					animate={{
						width: 48,
						translateX: 0,
						marginHorizontal: 5,
					}}
					transition={{
						type: "timing",
						duration: 500,
						easing: Easing.out(Easing.poly(5)),
						delay: 400,
					}}
					renderToHardwareTextureAndroid
					shouldRasterizeIOS
				>
					<Button
						size="icon"
						variant={"outline"}
						onPress={() => {}}
						className="h-12 aspect-square "
					>
						<IconPlus size={24} color={isDarkColorScheme ? "#fff" : "#000"} />
					</Button>
				</MotiView>
			</DropdownMenu.Trigger>

			<DropdownMenu.Content>
				{actions.map((action, index) => (
					<DropdownMenu.Item key={index.toString()} onSelect={action.onSelect}>
						<DropdownMenu.ItemTitle>{action.title}</DropdownMenu.ItemTitle>
						<DropdownMenu.ItemIcon
							ios={{
								name: action.ios as any,
							}}
							androidIconName={action.ios}
						/>
					</DropdownMenu.Item>
				))}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
}
