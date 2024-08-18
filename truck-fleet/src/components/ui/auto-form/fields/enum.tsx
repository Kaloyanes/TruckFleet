import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type * as z from "zod";
import AutoFormLabel from "../common/label";
import AutoFormTooltip from "../common/tooltip";
import type { AutoFormInputComponentProps } from "../types";
import { getBaseSchema } from "../utils";
import { useTranslations } from "next-intl";

export default function AutoFormEnum({
	label,
	isRequired,
	field,
	fieldConfigItem,
	zodItem,
	fieldProps,
}: AutoFormInputComponentProps) {
	const baseValues = (getBaseSchema(zodItem) as unknown as z.ZodEnum<any>)._def
		.values;

	let values: [string, string][] = [];
	if (!Array.isArray(baseValues)) {
		values = Object.entries(baseValues);
	} else {
		values = baseValues.map((value) => [value, value]);
	}

	function findItem(value: any) {
		return values.find((item) => item[0] === value);
	}

	const t = useTranslations("AddOrderSheet");

	return (
		<FormItem>
			<AutoFormLabel
				label={fieldConfigItem?.label || label}
				isRequired={isRequired}
			/>
			<FormControl>
				<Select
					onValueChange={field.onChange}
					defaultValue={field.value}
					{...fieldProps}
				>
					<SelectTrigger className={fieldProps.className}>
						<SelectValue placeholder={fieldConfigItem.inputProps?.placeholder}>
							{field.value ? t(field.value) : t("selectOption")}
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						{values.map(([value, label]) => (
							<SelectItem value={label} key={value}>
								{t(label as any)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</FormControl>
			<AutoFormTooltip fieldConfigItem={fieldConfigItem} />
			<FormMessage />
		</FormItem>
	);
}
