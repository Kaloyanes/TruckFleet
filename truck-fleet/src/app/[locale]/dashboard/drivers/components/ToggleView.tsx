"use client";
import React, { useEffect } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { IconLayout2, IconLayoutList } from "@tabler/icons-react";
import { useDriverToggleViewContext } from "@/context/drivers/driver-toggle-view-context";
import { useLocalStorage } from "react-use";

export default function ToggleView() {
	const { view, setView } = useDriverToggleViewContext();

	const [value, setValue] = useLocalStorage("driver-view", "list");
	if (typeof window === "undefined") return null;

	return (
		<>
			<ToggleGroup
				className="absolute top-1 right-4 "
				type="single"
				variant={"outline"}
				defaultValue={value ?? "list"}
				value={value ?? "list"}
				onValueChange={(value) => {
					setView(value);
					setValue(value);
				}}
			>
				<ToggleGroupItem value="grid" className="bg-black/20">
					<IconLayout2 />
				</ToggleGroupItem>
				<ToggleGroupItem value="list" className="bg-black/20">
					<IconLayoutList />
				</ToggleGroupItem>
			</ToggleGroup>
		</>
	);
}
