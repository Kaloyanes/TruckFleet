import React from "react";

export default function LoadingSpinner() {
	return (
		<div className="flex flex-col items-center justify-center h-screen w-screen z-[10000] ">
			<div className="w-20 h-20 mt-4">
				<div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-gray-900 dark:border-gray-100" />
			</div>
		</div>
	);
}
