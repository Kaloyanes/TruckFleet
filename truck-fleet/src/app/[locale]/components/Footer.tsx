import { Link } from "@/i18n/routing";
import React from "react";

export default function Footer() {
	return (
		<div className="h-52 bg-muted">
			<div className="flex flex-row justify-between">
				<div className="flex flex-col">
					<h3 className="text-lg font-medium">Contact</h3>
					<p className="text-sm text-muted-foreground">
						Email:{" "}
						<Link href="mailto:hello@example.com">hello@example.com</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
