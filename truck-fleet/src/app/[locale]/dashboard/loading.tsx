export default function Loading() {
	// Or a custom loading skeleton component
	return (
		<div className="z-[10000] flex h-screen w-screen flex-col items-center justify-center ">
			<div className="mt-4 h-20 w-20">
				<div className="h-20 w-20 animate-spin rounded-full border-gray-900 border-t-2 border-b-2 dark:border-gray-100" />
			</div>
		</div>
	);
}
