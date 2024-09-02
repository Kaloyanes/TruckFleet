import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { IconLayout2, IconLayoutList } from "@tabler/icons-react";
import { unstable_setRequestLocale } from "next-intl/server";
import React from "react";

export default function DriversPage({
	params: { locale },
}: { params: { locale: string } }) {
	unstable_setRequestLocale(locale);

	return (
		<div className="flex flex-col relative">
			<h1>Hello World</h1>
			<ToggleGroup
				className="absolute top-4 right-4"
				type="single"
				defaultValue="b"
				variant={"outline"}
			>
				<ToggleGroupItem value="a">
					<IconLayout2 />
				</ToggleGroupItem>
				<ToggleGroupItem value="b">
					<IconLayoutList />
				</ToggleGroupItem>
			</ToggleGroup>
		</div>
	);
}
