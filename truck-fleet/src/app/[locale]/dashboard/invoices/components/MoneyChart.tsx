"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { IconCurrencyDollar } from "@tabler/icons-react";
import { useLocale } from "next-intl";

export const description = "An area chart with gradient fill";

export function MoneyChart() {
	const locale = useLocale();

	const getLast12Months = () => {
		const months = [];
		const date = new Date();
		for (let i = 12; i >= 0; i--) {
			const month = new Date(date.getFullYear(), date.getMonth() - i);
			months.push(
				month.toLocaleDateString(locale, {
					month: "long",
					year: "numeric",
				}),
			);
		}
		return months;
	};

	const chartData = getLast12Months().map((month) => ({
		month,
		money: Math.round(Math.random() * 1000),
	}));

	const chartConfig = {
		money: {
			label: "Money",
			color: "hsl(var(--chart-2))",
			icon: IconCurrencyDollar,
		},
	} satisfies ChartConfig;

	return (
		<ChartContainer config={chartConfig}>
			<AreaChart
				accessibilityLayer
				data={chartData}
				margin={{
					left: 12,
					right: 12,
					bottom: 20,
				}}
			>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey="month"
					tickLine={false}
					axisLine={false}
					tickMargin={8}
					className="capitalize"
					tickFormatter={(value: any) => value.slice(0, 3)}
				/>
				<ChartTooltip
					cursor={false}
					animationEasing="ease-in-out"
					animationDuration={200}
					active={true}
					content={<ChartTooltipContent className="capitalize" />}
				/>
				<defs>
					<linearGradient id="fillmoney" x1="0" y1="0" x2="0" y2="1">
						<stop
							offset="25%"
							stopColor="var(--color-money)"
							stopOpacity={0.8}
						/>
						<stop
							offset="75%"
							stopColor="var(--color-money)"
							stopOpacity={0.1}
						/>
					</linearGradient>
				</defs>
				<Area
					dataKey="money"
					type="bumpX"
					fill="url(#fillmoney)"
					fillOpacity={0.5}
					stroke="var(--color-money)"
					stackId="a"
				/>
			</AreaChart>
		</ChartContainer>
	);
}
