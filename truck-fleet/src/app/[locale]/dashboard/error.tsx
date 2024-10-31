"use client";

import { useEffect } from "react";

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);

	return (
		<div className="">
			<h2>Something went wrong!</h2>
			<p>
				We're sorry, an unexpected error occurred. Please try again in a few
				minutes.
			</p>

			<h3>Error details:</h3>
			<pre>{error.message}</pre>
			<button
				type="button"
				onClick={
					// Attempt to recover by trying to re-render the segment
					() => reset()
				}
			>
				Try again
			</button>
		</div>
	);
}
