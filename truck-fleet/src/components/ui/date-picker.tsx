"use client";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { forwardRef } from "react";
import { useTranslations } from "next-intl";
import { Calendar } from "lucide-react";

export const DatePicker = forwardRef<
	HTMLDivElement,
	{
		date?: Date;
		setDate: (date?: Date) => void;
	}
>(function DatePickerCmp({ date, setDate }, ref) {
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
					<Calendar className="mr-2 h-4 w-4" />
					{date ? format(date, "PPP") : <span>{t("pickDate")}</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" ref={ref}>
				<Calendar
					mode="single"
					selected={date}
					onSelect={setDate}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
});
