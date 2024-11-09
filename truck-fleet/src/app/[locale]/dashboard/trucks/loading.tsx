import { Spinner } from "@/components/ui/loading-spinner";

export default function Loading() {
	// Or a custom loading skeleton component
	return (
		<div className="flex h-full w-full items-center justify-center overflow-hidden">
			<Spinner />
		</div>
	);
}
