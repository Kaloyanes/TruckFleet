import { Spinner } from "@/components/ui/loading-spinner";

export default function Loading() {
	// Or a custom loading skeleton component
	return (
		<div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-screen w-screen">
			<Spinner />
		</div>
	);
}
