import { Link } from "@/i18n/routing";

export default function NotFound() {
	return (
		<div className="bg-background">
			<h2>Not Found</h2>
			<p>Could not find requested resource</p>
			<Link href="/dashboard">Return Home</Link>
		</div>
	);
}
