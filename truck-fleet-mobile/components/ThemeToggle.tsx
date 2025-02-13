import { MoonStar } from "~/lib/icons/MoonStar";
import { Sun } from "~/lib/icons/Sun";
import { useColorScheme } from "~/lib/useColorScheme";
import * as DropdownMenuZ from "zeego/dropdown-menu";
import { Button } from "~/components/ui/button";

export function ThemeToggle() {
	const { isDarkColorScheme, setColorScheme } = useColorScheme();

	const themes = [
		{ code: "light", name: "Light" },
		{ code: "dark", name: "Dark" },
		{ code: "system", name: "System" },
	];

	function changeTheme(theme: "light" | "dark" | "system") {
		setColorScheme(theme);
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
						key={theme.code}
						onSelect={() =>
							changeTheme(theme.code as "light" | "dark" | "system")
						}
					>
						<DropdownMenuZ.ItemTitle>{theme.name}</DropdownMenuZ.ItemTitle>
					</DropdownMenuZ.Item>
				))}
			</DropdownMenuZ.Content>
		</DropdownMenuZ.Root>
	);
}
