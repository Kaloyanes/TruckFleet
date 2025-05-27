"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import useCompanyId from "@/hooks/useCompanyId";
import { useTruckStore } from "@/stores/Trucks/TrucksStore";
import { useEffect, useMemo, useState } from "react";
import { IconTruck } from "@tabler/icons-react";
import { format } from "date-fns";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function TrucksExpenses() {
	const { companyId } = useCompanyId();
	const { trucks, loadTrucks } = useTruckStore();
	const [selectedTruck, setSelectedTruck] = useState<string>("all"); // "all" or license plate

	useEffect(() => {
		if (!companyId) return;
		loadTrucks(companyId);
	}, [companyId, loadTrucks]);

	const filteredTrucks = useMemo(() => {
		if (selectedTruck === "all") {
			return trucks;
		}
		return trucks.filter((truck) => truck.licensePlate === selectedTruck);
	}, [trucks, selectedTruck]);

	const chartData = useMemo(() => {
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
		return Array.from({ length: 30 }, (_, i) => {
			const date = new Date(thirtyDaysAgo);
			date.setDate(date.getDate() + i);
			const dateStr = date.toISOString().split("T")[0];

			// Use filteredTrucks here
			return filteredTrucks.reduce(
				(acc, truck) => {
					acc[truck.licensePlate] = Math.random() * 100; // Replace with actual expense data
					return acc;
				},
				{ date: dateStr } as Record<string, number | string>,
			);
		});
	}, [filteredTrucks]); // Depend on filteredTrucks

	const chartConfig = useMemo(() => {
		// Use filteredTrucks here
		return filteredTrucks.reduce(
			(acc, truck, index) => {
				acc[truck.licensePlate] = {
					label: truck.licensePlate,
					color: [
						"hsl(var(--chart-1))",
						"hsl(var(--chart-2))",
						"hsl(var(--chart-3))",
						"hsl(var(--chart-4))",
						"hsl(var(--chart-5))",
					][index % 5], // Color assignment might need adjustment if filtering
				};
				return acc;
			},
			{} as Record<string, { label: string; color: string }>,
		) satisfies ChartConfig;
	}, [filteredTrucks]);

	return (
		<Card>
			<CardHeader>
				<div className="flex flex-row items-center justify-between gap-2">
					<CardTitle className="flex flex-row items-center gap-2">
						<IconTruck className="size-8" />
						Truck Expenses
					</CardTitle>
					<Select value={selectedTruck} onValueChange={setSelectedTruck}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Select Truck" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Trucks</SelectItem>
							{trucks.map((truck) => (
								<SelectItem key={truck.licensePlate} value={truck.licensePlate}>
									{truck.licensePlate}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<CardDescription>
					Showing expenses per KM for the last 30 days
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<AreaChart
						accessibilityLayer
						data={chartData}
						margin={{ top: 25, right: 5, left: -10, bottom: 5 }}
					>
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(value) => format(new Date(value), "dd MM yyyy")}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent animationEasing="ease-out" />}
						/>
						<defs>
							{/* Render defs based on filteredTrucks */}
							{filteredTrucks.map((truck) => (
								<linearGradient
									key={truck.licensePlate}
									id={`fill-${truck.licensePlate}`}
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop
										offset="2%"
										stopColor={`var(--color-${truck.licensePlate})`}
										stopOpacity={0.4}
									/>
									<stop
										offset="98%"
										stopColor={`var(--color-${truck.licensePlate})`}
										stopOpacity={0.1}
									/>
								</linearGradient>
							))}
						</defs>
						{/* Render Areas based on filteredTrucks */}
						{filteredTrucks.map((truck) => (
							<Area
								key={truck.licensePlate}
								dataKey={truck.licensePlate}
								type="monotoneX"
								fill={`url(#fill-${truck.licensePlate})`}
								fillOpacity={0.4}
								stroke={`var(--color-${truck.licensePlate})`}
								stackId="a" // Stacking might behave differently when only one truck is selected
							/>
						))}
					</AreaChart>
				</ChartContainer>
			</CardContent>
			<CardFooter>
				<div className="flex w-full items-start gap-2 text-sm">
					<div className="grid gap-2">
						<div className="flex items-center gap-2 font-medium leading-none">
							Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
						</div>
						<div className="flex items-center gap-2 text-muted-foreground leading-none">
							January - June 2024
						</div>
					</div>
				</div>
			</CardFooter>
		</Card>
	);
}
