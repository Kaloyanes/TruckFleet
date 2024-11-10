import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface InvoiceInputProps {
	initialValue?: string | number;
	onSave?: (value: string) => void;
	multiline?: boolean;
}

export default function InvoiceInput({
	initialValue = "",
	onSave,
	multiline = false,
}: InvoiceInputProps) {
	const [value, setValue] = useState(String(initialValue));

	const handleBlur = () => {
		onSave?.(value);
	};

	if (multiline) {
		return (
			<Textarea
				className="flex w-full resize-none border-0 border-transparent border-b border-none bg-transparent p-0 transition-colors placeholder:text-muted-foreground focus:border-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-accent focus-visible:ring-opacity-50 focus-visible:ring-offset-0 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50"
				autoComplete="off"
				value={value}
				rows={5}
				onInput={(e) => setValue(e.currentTarget.value)}
				onBlur={handleBlur}
			/>
		);
	}

	return (
		<Input
			className="flex h-6 w-full min-w-0 flex-shrink border-0 border-transparent border-b border-none bg-transparent p-0 px-1 font-mono transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus:border-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-accent focus-visible:ring-opacity-50 focus-visible:ring-offset-0 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50"
			autoComplete="off"
			value={value}
			onInput={(e) => setValue(e.currentTarget.value)}
			onBlur={handleBlur}
		/>
	);
}
