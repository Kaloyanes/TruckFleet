import {
	type FirebaseFirestoreTypes,
	getFirestore,
} from "@react-native-firebase/firestore";
import { useState, useEffect } from "react";
// Added import for Profile type
import type { Profile } from "../models/profile";

export default function useProfileDoc(userId: string) {
	// Changed state type from FirebaseFirestoreTypes.DocumentData to Profile
	const [data, setData] = useState<Profile | undefined>(undefined);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const fetchProfile = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const docRef = await getFirestore()
					.collection("users")
					.doc(userId)
					.get();

				if (docRef.exists) {
					const data = docRef.data();
					// Cast the data to Profile
					if (data)
						setData({
							companyId: data.companyId,
							email: data.email,
							name: data.name,
							phone: data.phone,
							id: data.id,
							photoUrl: data.photoUrl,
							type: data.type,
							location: data.location ? data.location : undefined,
						});
				} else {
					setData(undefined);
				}
			} catch (err) {
				setError(err as Error);
			}
			setIsLoading(false);
		};

		if (userId) {
			fetchProfile();
		} else {
			setIsLoading(false);
		}
	}, [userId]);

	return { data, isLoading, error };
}
