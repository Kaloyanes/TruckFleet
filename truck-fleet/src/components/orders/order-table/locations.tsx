import React from "react";

interface ShowLocationsProp {
	locations: {
		address: string;
		start: Date;
		end: Date;
	}[];
}

export default function ShowLocations({ locations }: ShowLocationsProp) {
	return (
		<div className="flex flex-col">
			{locations.map((location, index) => (
				<div key={index} className="flex flex-col gap-1">
					<span>{location.address}</span>
					<span className="text-sm text-muted-foreground">
						{location.start.toLocaleString()} - {location.end.toLocaleString()}
					</span>
				</div>
			))}
		</div>
	);
}
