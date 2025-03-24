import { ActivityIndicator, TextInput, View, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { Text } from "~/components/ui/text";
import { Area, CartesianChart, Line, useChartPressState } from "victory-native";

import { useColorScheme } from "~/lib/useColorScheme";
import {
	vec,
	LinearGradient,
	useFont,
	Circle,
	FontStyle,
} from "@shopify/react-native-skia";

import Satoshi from "~/assets/fonts/Manrope.ttf";
import { MMKV } from "react-native-mmkv";
import { format, parseISO } from "date-fns";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import Animated, {
	useAnimatedProps,
	useDerivedValue,
	withSpring,
	type SharedValue,
	runOnJS,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";
Animated.addWhitelistedNativeProps({ text: true });
import * as Haptics from "expo-haptics";

const mmkv = new MMKV({
	id: "kaloyanes.km",
});

const LAST_DAYS_KEY = "chart_last_days";
const DEFAULT_LAST_DAYS = "2";

const getLastNDaysData = (n: number) => {
	const data = [];
	const today = new Date();

	for (let i = n + 1; i >= 0; i--) {
		const date = new Date(today);
		date.setDate(date.getDate() - i);
		// Changed: use local formatting to correctly reflect the day at midnight.
		const dateStr = format(date, "yyyy-MM-dd");
		const km = mmkv.getNumber(`km_${dateStr}`) || 0;

		data.push({
			day: n - i + 1,
			km: Number(km.toFixed(2)),
			date: dateStr,
		});
	}

	return data;
};

const getTickInterval = (days: number) => {
	if (days <= 3) return 3;
	if (days <= 7) return 5; // Show all labels for 7 or fewer days
	if (days <= 14) return 7;
	if (days <= 31) return 7;
	return 10;
};

function ToolTip({
	x,
	y,
	isDarkColorScheme,
}: {
	x: SharedValue<number>;
	y: SharedValue<number>;
	isDarkColorScheme: boolean;
}) {
	return (
		<Circle cx={x} cy={y} r={8} color={isDarkColorScheme ? "#fff" : "000"} />
	);
}

const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function KmChart() {
	const [chartData, setChartData] = useState<
		Array<{ day: number; km: number; date: string }>
	>([]);
	const font = useFont(Satoshi);
	const { isDarkColorScheme } = useColorScheme();
	const { t, i18n } = useTranslation();

	// Get translated month names from i18n
	const translatedMonths = [
		t("months.jan"),
		t("months.feb"),
		t("months.mar"),
		t("months.apr"),
		t("months.may"),
		t("months.jun"),
		t("months.jul"),
		t("months.aug"),
		t("months.sep"),
		t("months.oct"),
		t("months.nov"),
		t("months.dec"),
	];

	// English month names for chart labels (to avoid font issues)
	const chartMonthNames = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	const [lastDays, setLastDays] = useState(
		Number(mmkv.getString(LAST_DAYS_KEY) || DEFAULT_LAST_DAYS),
	);

	const formatDate = (date: Date) => {
		"worklet";
		const day = date.getDate();
		const month = translatedMonths[date.getMonth()];
		return `${day} ${month}`;
	};

	// Modify the initial state to use the last data point
	const { state, isActive } = useChartPressState({
		x: chartData.length - 1,
		y: {
			km: chartData.length > 0 ? chartData[chartData.length - 1].km : 0,
		},
	});

	const tickInterval = getTickInterval(lastDays);
	const tickValues = chartData.map((x) => x.day);

	const textValue = useDerivedValue(() => {
		return `${state.y.km.value.value.toFixed(1)} KM`;
	});

	useEffect(() => {
		setChartData(getLastNDaysData(lastDays));

		// Update every minute
		const interval = setInterval(() => {
			setChartData(getLastNDaysData(lastDays));
		}, 1000);

		return () => clearInterval(interval);
	}, [lastDays]);

	const animatedText = useAnimatedProps(() => {
		let kmValue = 0;
		if (chartData.length > 0) {
			kmValue =
				isActive && state.x.value.value < chartData.length
					? state.y.km.value.value
					: chartData[chartData.length - 1].km;
		}

		return {
			text: `${kmValue.toFixed(2)} KM`,
			defaultValue: `${kmValue.toFixed(2)} KM`,
		};
	});

	const animatedDateText = useAnimatedProps(() => {
		let date = new Date();
		if (chartData.length > 0) {
			date =
				isActive && state.x.value.value < chartData.length
					? new Date(chartData[state.x.value.value]?.date || Date.now())
					: new Date(chartData[chartData.length - 1].date);
		}

		return {
			text: formatDate(date),
			defaultValue: formatDate(date),
		};
	});

	if (chartData.length === 0) {
		return (
			<View className="h-[450px] items-center justify-center">
				<ActivityIndicator
					size="large"
					color={isDarkColorScheme ? "#fff" : "#000"}
				/>
			</View>
		);
	}

	return (
		<>
			<View className="flex-col px-6 items-start gap-1">
				<AnimatedTextInput
					editable={false}
					underlineColorAndroid={"transparent"}
					className="text-foreground w-full text-4xl font-bold"
					animatedProps={animatedText}
				/>
				<AnimatedTextInput
					editable={false}
					underlineColorAndroid={"transparent"}
					className="text-foreground w-full text-4xl"
					animatedProps={animatedDateText}
				/>
			</View>
			<ToggleGroup
				type="single"
				value={lastDays.toString()}
				onValueChange={(value) => {
					const newValue = value ?? DEFAULT_LAST_DAYS;
					setLastDays(Number(newValue));
					mmkv.set(LAST_DAYS_KEY, newValue);
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				}}
				className="flex-row justify-evenly gap-3 px-5"
			>
				{[
					{ value: "2", label: "1D" },
					{ value: "7", label: "1W" },
					{ value: "14", label: "2W" },
					{ value: "31", label: "1M" },
					{ value: "365", label: "1Y" },
				].map((item, index) => (
					<ToggleGroupItem
						key={index.toFixed()}
						value={item.value}
						aria-label="Toggle chart range"
						className="rounded-2xl flex-1 "
					>
						<Text>{item.label}</Text>
					</ToggleGroupItem>
				))}
			</ToggleGroup>
			<View className="flex-1 h-[300px]">
				<CartesianChart
					chartPressState={state}
					data={chartData}
					xKey="day"
					yKeys={["km"]}
					domainPadding={{
						bottom: 10,
						top: 10,
						left: 0,
						right: 0,
					}}
					viewport={{
						x: [0, lastDays + 1.5],
						y: [-5, Math.max(...chartData.map((d) => d.km + d.km * 0.15), 10)],
					}}
					xAxis={{
						labelColor: isDarkColorScheme ? "#ffffff75" : "#000000",
						formatXLabel: (value) => {
							const item = chartData.find((d) => d.day === value);
							if (!item) return "";
							const date = new Date(`${item.date}T00:00`);
							// Use English month names for chart axis labels to avoid font issues
							const day = date.getDate();
							const month = chartMonthNames[date.getMonth()];
							return `${day} ${month}`;
						},
						lineWidth: 0,
						font, // Use the Satoshi font which works correctly
						labelPosition: "inset",
						axisSide: "bottom",
						tickCount: tickInterval,
						tickValues: tickValues,
					}}
					yAxis={[
						{
							lineWidth: 0,
							lineColor: isDarkColorScheme ? "#fff" : "#000",
							labelOffset: 0,
							labelPosition: "inset",
							font, // Use the Satoshi font which works correctly
							labelColor: isDarkColorScheme ? "#ffffff50" : "#000000",
							tickCount: 5,
							axisSide: "right",
						},
					]}
					frame={{
						lineWidth: 0,
					}}
				>
					{({ points, chartBounds }) => (
						<>
							<Line
								connectMissingData
								points={points.km}
								color={isDarkColorScheme ? "#fff" : "#000"}
								curveType="monotoneX"
								strokeWidth={2}
								// animate={{
								// 	type: "spring",
								// 	duration: 300,
								// }}
							/>
							{isActive && (
								<ToolTip
									x={state.x.position}
									y={state.y.km.position}
									isDarkColorScheme={isDarkColorScheme}
								/>
							)}
						</>
					)}
				</CartesianChart>
			</View>
		</>
	);
}
