// dashboard/trucks/layout.tsx
import { Card, CardHeader } from "@/components/ui/card";
import { setRequestLocale } from "next-intl/server";
import LetterPullup from "@/components/ui/letter-pullup";
import AddTruckSheet from "./components/AddTruckSheet";

export default async function TrucksLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	const { locale } = await params;

	setRequestLocale(locale);
	return (
		<div className="relative flex flex-1 overflow-hidden">
			<Card className="relative w-full flex-1 rounded-none border-0 border-border border-l bg-background backdrop-saturate-150 transition-all duration-300">
				<CardHeader className="sticky top-0 mb-0 flex flex-row items-center justify-between border-b bg-sidebar">
					<div className="flex flex-col gap-4">
						<LetterPullup className="text-lg font-bold" words="Trucks" />
					</div>
					<AddTruckSheet />
				</CardHeader>
				<div className="relative w-full">{children}</div>
			</Card>
		</div>
	);
}
