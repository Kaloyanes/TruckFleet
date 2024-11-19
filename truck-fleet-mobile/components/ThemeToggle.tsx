import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, View } from "react-native";
import { trigger } from "react-native-haptic-feedback";
import { MoonStar } from "~/lib/icons/MoonStar";
import { Sun } from "~/lib/icons/Sun";
import { useColorScheme } from "~/lib/useColorScheme";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";

export function ThemeToggle() {
	const { isDarkColorScheme, setColorScheme } = useColorScheme();
	return (
		<Button
			size={"icon"}
			variant={"outline"}
			onPress={() => {
				const newTheme = isDarkColorScheme ? "light" : "dark";
				setColorScheme(newTheme);
				AsyncStorage.setItem("theme", newTheme);
				trigger("clockTick");
			}}
			className="web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 "
		>
			{isDarkColorScheme ? (
				<MoonStar className="text-foreground " size={23} strokeWidth={1.25} />
			) : (
				<Sun className="text-foreground " size={24} strokeWidth={1.25} />
			)}
		</Button>
	);
}
