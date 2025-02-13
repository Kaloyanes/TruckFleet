import { IconLanguage } from "@tabler/icons-react-native";
import * as React from "react";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { Button } from "~/components/ui/button";

import * as DropdownMenuZ from "zeego/dropdown-menu";
import * as Haptics from "expo-haptics";
import { changeLanguage } from "~/locales/i18n";
import { Languages } from "lib/icons/Language";

export default function LanguageSelector() {
	const languages = [
		{
			code: "en",
			name: "English",
		},
		{
			code: "bg",
			name: "Bulgarian",
		},
	];

	return (
		<DropdownMenuZ.Root modal>
			<DropdownMenuZ.Trigger asChild>
				<Button
					variant="outline"
					size={"icon"}
					style={{ padding: 10 }}
					onPressOut={() =>
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
					}
				>
					<Languages
						className="text-foreground "
						size={20}
						strokeWidth={1.25}
					/>
				</Button>
			</DropdownMenuZ.Trigger>
			<DropdownMenuZ.Content className="w-64 native:w-72">
				{languages.map((language) => (
					<DropdownMenuZ.Item
						key={language.code}
						onSelect={() => changeLanguage(language.code)}
					>
						<DropdownMenuZ.ItemTitle>{language.name}</DropdownMenuZ.ItemTitle>
					</DropdownMenuZ.Item>
				))}
			</DropdownMenuZ.Content>
		</DropdownMenuZ.Root>
	);
}
