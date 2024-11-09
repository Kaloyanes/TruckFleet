import { Spinner } from "@/components/ui/loading-spinner";

export default function Loading() {
	return (
		<div className="flex h-full w-full items-center justify-center overflow-hidden">
			<Spinner />
		</div>
	);
}
