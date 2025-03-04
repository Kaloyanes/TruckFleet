import { View } from "react-native";
import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { useTranslation } from "react-i18next";
import { MotiView } from "moti";
import { Text } from "~/components/ui/text";

export default function ForgotPasswordDialog() {
	const { t } = useTranslation();
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="link" className="self-end px-0">
					<Text className="text-primary">{t("forgot_password")}</Text>
				</Button>
			</DialogTrigger>
			<MotiView
				animate={{
					scale: [0.5, 1],
					opacity: [0, 1],
				}}
			>
				<DialogContent>
					<DialogHeader>
						<Text>Forgot Password</Text>
					</DialogHeader>
				</DialogContent>
			</MotiView>
		</Dialog>
	);
}
