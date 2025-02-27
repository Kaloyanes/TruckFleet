import { View } from "react-native";
import React from "react";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";

export default function NameStepPage() {
	const [value, setValue] = React.useState("");

	const onChangeText = (text: string) => {
		setValue(text);
	};
	return (
		<View className="flex-1 items-start justify-start mx-5 my-3">
			<Input
				placeholder="Name"
				value={value}
				onChangeText={onChangeText}
				aria-labelledby="inputLabel"
				aria-errormessage="inputError"
				className="!w-full"
				keyboardType="name-phone-pad"
				returnKeyType="next"
			/>
		</View>
	);
}
