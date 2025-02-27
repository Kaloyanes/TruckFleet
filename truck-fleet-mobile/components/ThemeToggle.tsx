import { MoonStar } from "~/lib/icons/MoonStar";
import { Sun } from "~/lib/icons/Sun";
import { useColorScheme } from "~/lib/useColorScheme";
import * as DropdownMenuZ from "zeego/dropdown-menu";
import { Button } from "~/components/ui/button";
import { Appearance } from "react-native";

export function ThemeToggle() {
	const { isDarkColorScheme, setColorScheme } = useColorScheme();

	const themes = [
		{ code: "light", name: "Light" },
		{ code: "dark", name: "Dark" },
	];

	function changeTheme(theme: "light" | "dark") {
		setColorScheme(theme);
		Appearance.setColorScheme(theme);
	}

	return (
		<DropdownMenuZ.Root modal>
			<DropdownMenuZ.Trigger asChild>
				<Button variant="outline" size="icon" style={{ padding: 10 }}>
					{isDarkColorScheme ? (
						<MoonStar
							className="text-foreground"
							size={20}
							strokeWidth={1.25}
						/>
					) : (
						<Sun className="text-foreground" size={24} strokeWidth={1.25} />
					)}
				</Button>
			</DropdownMenuZ.Trigger>
			<DropdownMenuZ.Content className="w-64 native:w-72">
				{themes.map((theme) => (
					<DropdownMenuZ.Item
						style={{
							backgroundColor: theme.code === "dark" ? "black" : "white",
							color: theme.code === "dark" ? "white" : "black",
						}}
						key={theme.code}
						onSelect={() => changeTheme(theme.code as "light" | "dark")}
					>
						<DropdownMenuZ.ItemTitle>{theme.name}</DropdownMenuZ.ItemTitle>
					</DropdownMenuZ.Item>
				))}
			</DropdownMenuZ.Content>
		</DropdownMenuZ.Root>
	);
}
