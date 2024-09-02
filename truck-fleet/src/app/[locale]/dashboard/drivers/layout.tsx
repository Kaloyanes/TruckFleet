import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ToggleGroupItem } from "@/components/ui/toggle-group";
import { ToggleGroup } from "@radix-ui/react-toggle-group";
import {
	IconGrid4x4,
	IconGridDots,
	IconLayout2,
	IconLayoutList,
	IconList,
} from "@tabler/icons-react";
import { Grid } from "lucide-react";
import { unstable_setRequestLocale } from "next-intl/server";

export default function DriversLayout({
	children,
	params: { locale },
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);

	return (
		<>
			<Card className="w-full border-0 border-l rounded-none">
				<CardHeader className="border-b flex flex-row justify-between items-center">
					<div className="flex flex-col gap-4">
						<h1 className="text-2xl font-bold">Drivers</h1>
						<Input placeholder="Search Drivers" />
					</div>
					<Button>Add Driver</Button>
				</CardHeader>
				<CardContent className="py-4">
					<section>{children}</section>
				</CardContent>
			</Card>
		</>
	);
}
