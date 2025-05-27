import { View } from "react-native";
import React from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { useTranslation } from "react-i18next";
import { MotiView } from "moti";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { BodyScrollView } from "~/components/ui/body-scroll-view";

export default function ForgotPasswordDialog() {
	const { t } = useTranslation();
	return (
		<BodyScrollView>
			<View className="flex-1 items-center justify-center">
				<Text>Forgot Password</Text>
			</View>
		</BodyScrollView>
	);
}
