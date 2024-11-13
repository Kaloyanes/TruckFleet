"use client";
import { Spinner } from "@/components/ui/loading-spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useDriverOptionsStore } from "@/stores/Drivers/DriverOptionsStore";
import { IconLayout2, IconLayoutList } from "@tabler/icons-react";

export default function ToggleView() {
	const { view, setView } = useDriverOptionsStore();

	if (typeof window === "undefined") return <Spinner />;

	return (
		<ToggleGroup
			className="absolute top-1 right-4"
			type="single"
			variant="outline"
			value={view}
			onValueChange={(newView) => {
				if (newView) {
					setView(newView as "grid" | "list");
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
