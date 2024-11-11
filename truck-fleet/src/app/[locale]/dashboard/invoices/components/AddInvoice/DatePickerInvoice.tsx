import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useInvoiceOptionsStore } from "@/stores/InvoiceOptionsStore";
import { format, formatDate } from "date-fns";
import { bg } from "date-fns/locale";
import { useLocale } from "next-intl";
import { forwardRef } from "react";

export const DatePickerInvoice = forwardRef<
	HTMLDivElement,
	{
		date: Date;
		setDate: (date: Date) => void;
		formatOption?: string;
		startDate?: Date;
	}
>(function DatePickerCmp({ date, setDate, formatOption, startDate }, ref) {
	const locale = useLocale();
	const optionsStore = useInvoiceOptionsStore();

	return (
		<Popover>
			<PopoverTrigger>
				<h3>
					{date ? format(date, optionsStore.options.dateFormat) : "Pick a date"}
				</h3>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" ref={ref}>
				<Calendar
					fromDate={startDate}
					formatters={{
						formatCaption: (date) => {
							return (
								<h1 className="capitalize font-mono">
									{formatDate(date, "LLLL yyyy", {
										locale: locale !== "en" ? bg : undefined,
									})}
								</h1>
							);
						},
						formatWeekdayName: (date) => {
							return (
								<span className="text-sm capitalize">
									{formatDate(date, "EEEEEE", {
										locale: locale !== "en" ? bg : undefined,
									})}
								</span>
							);
						},
					}}
					mode="single"
					selected={date}
					onSelect={(newDate) => {
						if (newDate) setDate(newDate);
					}}
					initialFocus
					lang={locale}
				/>
			</PopoverContent>
		</Popover>
	);
});