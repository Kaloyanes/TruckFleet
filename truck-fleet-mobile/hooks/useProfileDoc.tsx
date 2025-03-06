import {
	type FirebaseFirestoreTypes,
	getFirestore,
} from "@react-native-firebase/firestore";
import { useState, useEffect } from "react";

export default function useProfileDoc(userId: string) {
	const [data, setData] = useState<
		FirebaseFirestoreTypes.DocumentData | undefined
	>(undefined);
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
					setData(data);
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
