import { getApp } from "@react-native-firebase/app";
import firestore, {
	collection,
	doc,
	getDocs,
	setDoc,
	deleteDoc,
	updateDoc,
	addDoc,
	type FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { create } from "zustand";
import { getAuth } from "@react-native-firebase/auth";
import {
	getStorage,
	ref,
	uploadBytes,
	getDownloadURL,
	deleteObject,
} from "@react-native-firebase/storage";

export type Doc = {
	id: string;
	name: string;
	type: string;
	url: string[];
	createdAt: Date;
};

const docConverter = {
	toFirestore: (doc: Doc) => ({
		id: doc.id,
		name: doc.name,
		type: doc.type,
		url: doc.url,
		createdAt: doc.createdAt,
	}),
	fromFirestore: (snapshot: FirebaseFirestoreTypes.DocumentSnapshot) => {
		const data = snapshot.data();
		if (!data) return null;

		const createdAt = data.createdAt?.toDate
			? data.createdAt.toDate()
			: new Date();

		return {
			id: snapshot.id,
			name: data.name,
			type: data.type,
			url: Array.isArray(data.url) ? data.url : data.url ? [data.url] : [],
			createdAt: createdAt,
		} as Doc;
	},
};

interface DocumentStore {
	documents: Doc[];
	isLoading: boolean;
	currentDocs: (Omit<Doc, "id" | "createdAt" | "url"> & { uri?: string })[];
	loadDocuments: (userId?: string) => Promise<void>;
	addDocuments: () => Promise<Doc[]>;
	removeDocument: (document: Doc) => Promise<void>;
	updateDocument: (document: Doc) => Promise<void>;
	setCurrentDocs: (
		docs: (Omit<Doc, "id" | "createdAt" | "url"> & { uri?: string })[],
	) => void;
	addCurrentDoc: (
		doc: Omit<Doc, "id" | "createdAt" | "url"> & { uri?: string },
	) => void;
	removeCurrentDoc: (index: number) => void;
	clearCurrentDocs: () => void;
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
	documents: [],
	isLoading: false,

	currentDocs: [],

	setCurrentDocs: (docs) => set({ currentDocs: docs }),
	addCurrentDoc: (doc) =>
		set((state) => ({ currentDocs: [...state.currentDocs, doc] })),
	removeCurrentDoc: (index) =>
		set((state) => ({
			currentDocs: state.currentDocs.filter((_, i) => i !== index),
		})),
	clearCurrentDocs: () => set({ currentDocs: [] }),
	loadDocuments: async (userId?: string) => {
		try {
			set({ isLoading: true });

			const currentUserId = userId || getAuth().currentUser?.uid;
			if (!currentUserId) {
				console.error("No user ID available");
				return;
			}

			const docsCollection = firestore()
				.collection("users")
				.doc(currentUserId)
				.collection("documents");

			const snapshot = await docsCollection.get();

			const documents: Doc[] = snapshot.docs
				.map((docSnapshot: FirebaseFirestoreTypes.DocumentSnapshot) => {
					const data = docSnapshot.data();
					if (!data) {
						console.warn(`Document ${docSnapshot.id} has invalid data.`);
						return null;
					}

					const createdAt = data.createdAt?.toDate
						? data.createdAt.toDate()
						: new Date();
					const url = Array.isArray(data.url)
						? data.url
						: data.url
							? [data.url]
							: [];

					return {
						id: docSnapshot.id,
						name: data.name,
						type: data.type,
						url: url,
						createdAt: createdAt,
					} as Doc;
				})
				.filter((doc): doc is Doc => doc !== null);

			set({ documents, isLoading: false });
		} catch (error) {
			console.error("Error loading documents:", error);
			set({ isLoading: false });
		}
	},

	addDocuments: async () => {
		try {
			set({ isLoading: true });

			const currentDocs = get().currentDocs;
			if (!currentDocs.length) {
				throw new Error("No documents to add");
			}

			const currentUserId = getAuth().currentUser?.uid;
			if (!currentUserId) {
				throw new Error("User not authenticated");
			}

			const newDocs: Doc[] = [];

			for (const currentDoc of currentDocs) {
				if (!currentDoc.uri) continue;

				const storage = getStorage();
				const storageRef = ref(
					storage,
					`${currentUserId}/${Date.now()}_${currentDoc.name}`,
				);

				await storageRef.putFile(currentDoc.uri);
				const url = await storageRef.getDownloadURL();

				const docRef = await firestore()
					.collection("users")
					.doc(currentUserId)
					.collection("documents")
					.add({
						name: currentDoc.name,
						type: currentDoc.type,
						url: [url],
						createdAt: new Date(),
					});

				const docSnapshot = await docRef.get();
				const data = docSnapshot.data();

				if (data) {
					const createdAt = data.createdAt?.toDate
						? data.createdAt.toDate()
						: new Date();
					const urlResult = Array.isArray(data.url)
						? data.url
						: data.url
							? [data.url]
							: [];

					const newDoc: Doc = {
						id: docSnapshot.id,
						name: data.name,
						type: data.type,
						url: urlResult,
						createdAt: createdAt,
					};
					newDocs.push(newDoc);
				} else {
					console.warn(
						`Failed to retrieve data for newly added doc ${docRef.id}`,
					);
				}
			}

			set((state) => ({
				documents: [...state.documents, ...newDocs],
				isLoading: false,
				currentDocs: [],
			}));

			return newDocs;
		} catch (error) {
			console.error("Error adding documents:", error);
			set({ isLoading: false });
			throw error;
		}
	},
	removeDocument: async (document: Doc) => {
		try {
			set({ isLoading: true });

			const currentUserId = getAuth().currentUser?.uid;
			if (!currentUserId) {
				throw new Error("User not authenticated");
			}

			await firestore()
				.collection("users")
				.doc(currentUserId)
				.collection("documents")
				.doc(document.id)
				.delete();

			if (document.url && document.url.length > 0) {
				try {
					const storage = getStorage();
					const fileUrlToDelete = document.url[0];
					if (fileUrlToDelete) {
						const storageRef = ref(storage, fileUrlToDelete);
						await deleteObject(storageRef);
					} else {
						console.warn(
							`Document ${document.id} has an empty URL at index 0.`,
						);
					}
				} catch (storageError: unknown) {
					if (
						(storageError as { code?: string })?.code !==
						"storage/object-not-found"
					) {
						console.error("Error removing file from storage:", storageError);
					} else {
						console.log(
							`File not found in storage for doc ${document.id}, URL: ${document.url[0]}. Skipping deletion.`,
						);
					}
				}
			} else {
				console.log(
					`Document ${document.id} has no URL to delete from storage.`,
				);
			}

			set((state) => ({
				documents: state.documents.filter((doc) => doc.id !== document.id),
				isLoading: false,
			}));
		} catch (error) {
			console.error("Error removing document:", error);
			set({ isLoading: false });
		}
	},

	updateDocument: async (document: Doc) => {
		try {
			set({ isLoading: true });

			const currentUserId = getAuth().currentUser?.uid;
			if (!currentUserId) {
				throw new Error("User not authenticated");
			}

			await firestore()
				.collection("users")
				.doc(currentUserId)
				.collection("documents")
				.doc(document.id)
				.update({
					name: document.name,
					type: document.type,
					url: document.url,
					createdAt: document.createdAt,
				});

			set((state) => ({
				documents: state.documents.map((doc) =>
					doc.id === document.id ? document : doc,
				),
				isLoading: false,
			}));
		} catch (error) {
			console.error("Error updating document:", error);
			set({ isLoading: false });
		}
	},
}));
