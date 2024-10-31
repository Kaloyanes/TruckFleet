"use client";
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { IconLayout2, IconLayoutList } from "@tabler/icons-react";
import { useDriverToggleViewContext } from "@/context/drivers/driver-toggle-view-context";
import { Spinner } from "@/components/ui/loading-spinner";

export default function ToggleView() {
	const { view, setView } = useDriverToggleViewContext();

	if (typeof window === "undefined") return <Spinner />;

	return (
		<ToggleGroup
			className="absolute top-1 right-4"
			type="single"
			variant="outline"
			value={view}
			onValueChange={(newView) => {
				if (newView) {
					setView(newView);
					localStorage.setItem("driver-view", newView);
				}
			}}
		>
			<ToggleGroupItem value="grid" className="bg-black/20">
				<IconLayout2 />
			</ToggleGroupItem>
			<ToggleGroupItem value="list" className="bg-black/20">
				<IconLayoutList />
			</ToggleGroupItem>
		</ToggleGroup>
	);
}
