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
	url: string;
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

		return {
			id: data.id,
			name: data.name,
			type: data.type,
			url: data.url,
			createdAt: data.createdAt?.toDate() || new Date(),
		} as Doc;
	},
};

interface DocumentStore {
	documents: Doc[];
	isLoading: boolean;
	currentDoc: (Omit<Doc, "id" | "createdAt" | "url"> & { uri?: string }) | null;
	loadDocuments: (userId?: string) => Promise<void>;
	addDocument: () => Promise<Doc>;
	removeDocument: (document: Doc) => Promise<void>;
	updateDocument: (document: Doc) => Promise<void>;
	setCurrentDoc: (
		doc: (Omit<Doc, "id" | "createdAt" | "url"> & { uri?: string }) | null,
	) => void;
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
	documents: [],
	isLoading: false,

	currentDoc: null,

	setCurrentDoc: (doc: Omit<Doc, "id" | "createdAt" | "url"> | null) =>
		set({ currentDoc: doc }),
	loadDocuments: async (userId?: string) => {
		try {
			set({ isLoading: true });

			// Use provided userId or current user's id
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

			const documents = snapshot.docs
				.map((doc) => ({ ...doc.data(), id: doc.id }) as Doc)
				.map((doc) => ({
					...doc,
					createdAt:
						doc.createdAt instanceof Date
							? doc.createdAt
							: new Date(doc.createdAt),
				}));

			set({ documents, isLoading: false });
		} catch (error) {
			console.error("Error loading documents:", error);
			set({ isLoading: false });
		}
	},

	addDocument: async () => {
		try {
			set({ isLoading: true });

			const currentDoc = get().currentDoc;
			if (!currentDoc || !currentDoc.uri) {
				throw new Error("No document to add");
			}

			const currentUserId = getAuth().currentUser?.uid;
			if (!currentUserId) {
				throw new Error("User not authenticated");
			}

			// Upload file to storage
			const storage = getStorage();
			const storageRef = ref(
				storage,
				`${currentUserId}/${Date.now()}_${currentDoc.name}`,
			);
			const file = new File([currentDoc.uri], currentDoc.name);

			const uploadTask = await uploadBytes(storageRef, file);
			const url = await getDownloadURL(uploadTask.ref);

			// Create document in Firestore
			const docRef = await firestore()
				.collection("users")
				.doc(currentUserId)
				.collection("documents")
				.add({
					name: currentDoc.name,
					type: currentDoc.type,
					url: url,
					createdAt: new Date(),
				});

			// Get the created document
			const docSnapshot = await docRef.get();
			const newDoc = {
				...docSnapshot.data(),
				id: docSnapshot.id,
			} as Doc;

			// Update local state
			set((state) => ({
				documents: [...state.documents, newDoc],
				isLoading: false,
				currentDoc: null,
			}));

			return newDoc;
		} catch (error) {
			console.error("Error adding document:", error);
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

			// Remove from Firestore
			await firestore()
				.collection("users")
				.doc(currentUserId)
				.collection("documents")
				.doc(document.id)
				.delete();

			// If document has a file URL, remove from storage
			if (document.url) {
				try {
					const storage = getStorage();
					const storageRef = ref(storage, document.url);
					await deleteObject(storageRef);
				} catch (storageError) {
					console.error("Error removing file from storage:", storageError);
				}
			}

			// Update local state
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

			// Update in Firestore
			await firestore()
				.collection("users")
				.doc(currentUserId)
				.collection("documents")
				.doc(document.id)
				.update(document);

			// Update local state
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
