"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/Utils";
import { IconCalendarClock } from "@tabler/icons-react";
import { addDays, format } from "date-fns";
import { useTranslations } from "next-intl";
import * as React from "react";
import { TimePickerDemo } from "./time-picker-demo";

export function DateTimePicker() {
	const [date, setDate] = React.useState<Date>();

	/**
	 * carry over the current time when a user clicks a new day
	 * instead of resetting to 00:00
	 */
	const handleSelect = (newDay: Date | undefined) => {
		if (!newDay) return;
		if (!date) {
			setDate(newDay);
			return;
		}
		const diff = newDay.getTime() - date.getTime();
		const diffInDays = diff / (1000 * 60 * 60 * 24);
		const newDateFull = addDays(date, Math.ceil(diffInDays));
		setDate(newDateFull);
	};

	const t = useTranslations("AutoForm");

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-full justify-start text-left font-normal",
						!date && "text-muted-foreground",
					)}
				>
					<IconCalendarClock className="mr-2 h-5 w-5" />
					{date ? format(date, "PP HH:mm") : <span>{t("pickDate")}</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar
					mode="single"
					selected={date}
					onSelect={(d) => handleSelect(d)}
					initialFocus
				/>
				<div className="border-border border-t p-3">
					<TimePickerDemo setDate={setDate} date={date} />
				</div>
			</PopoverContent>
		</Popover>
	);
}
