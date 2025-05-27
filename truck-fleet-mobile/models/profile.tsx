export interface Profile {
	id: string;
	name: string;
	companyId: string;
	email: string;
	phone: string;
	photoUrl: string;
	type: "driver" | "speditor" | "ceo";
	location?: {
		latitude: number;
		longitude: number;
		heading: number;
		speed: number;
		timestamp: Date;
		altitude: number;
		altitudeAccuracy: number;
		accuracy: number;
	};
}
