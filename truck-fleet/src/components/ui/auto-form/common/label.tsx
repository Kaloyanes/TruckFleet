import { FormLabel } from "@/components/ui/form";
import { cn } from "@/lib/Utils";

function AutoFormLabel({
	label,
	isRequired,
	className,
}: {
	label: string;
	isRequired: boolean;
	className?: string;
}) {
	return (
		<>
			<FormLabel className={cn(className)}>
				{label}
				{isRequired && <span className="text-destructive"> *</span>}
			</FormLabel>
		</>
	);
}

export default AutoFormLabel;
