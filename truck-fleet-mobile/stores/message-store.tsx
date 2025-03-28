import { create } from "zustand";
import firestore, {
	type FirebaseFirestoreTypes,
	Timestamp,
	firebase,
} from "@react-native-firebase/firestore";
import { useSharedValue, type SharedValue } from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { useRef } from "react";
import type { FlashList } from "@shopify/flash-list";
import { toast } from "sonner-native";
import { t } from "i18next";
import { router } from "expo-router";

export type Message = {
	id: string;
	content: string;
	sender: string;
	type: "file" | "image" | "text" | "location" | "video" | "audio";
	createdAt: FirebaseFirestoreTypes.Timestamp;
	updatedAt?: FirebaseFirestoreTypes.Timestamp;
	fileName?: string;
	fileType?: string;
};

interface MessageStore {
	messages: Message[];
	loading: boolean;
	error: unknown | null;
	currentMessage: string;
	isTyped: boolean;
	chatId: string;
	unsubscribeMessages: (() => void)[] | null;
	isRefreshing: boolean;
	flashListRef: React.RefObject<FlashList<Message>> | null;
	statusOfMessage: number;
	isRecording: boolean;
	inputHeight: number;

	setInputHeight: (height: number) => void;
	setStatusOfMessage: (status: number) => void;
	setRef: (ref: React.RefObject<FlashList<Message>>) => void;
	loadMessages: (id: string) => Promise<void>;
	loadMoreMessages: (id: string) => Promise<void>;
	setMessage: (message: string) => void;
	sendMessage: () => void;
	sendPhoto: (type: "image" | "camera") => void;
	sendFile: () => void;
	sendAudio: (assetUri: string) => void;
	sendLocation: (latitude: number, longitude: number) => void;
	updateLastMessageToNow: () => void;
	setIsRecording: (isRecording: boolean) => void;
	deleteMessage: (message: Message) => Promise<void>;
}

const LIMIT_MESSAGES = 10;
export const useMessageStore = create<MessageStore>((set, get) => ({
	messages: [],
	loading: false,
	error: null,
	currentMessage: "",
	isTyped: false,
	chatId: "",
	unsubscribeMessages: null,
	isRefreshing: false,
	flashListRef: null,
	statusOfMessage: 0,
	isRecording: false,
	inputHeight: 48, // Default input height

	setInputHeight: (height) => {
		set({ inputHeight: height });
	},

	setIsRecording: (isRecording) => {
		set({ isRecording: isRecording });
	},

	setStatusOfMessage: (status) => {
		set({ statusOfMessage: status });
	},
	setRef: (ref) => {
		set({ flashListRef: ref });
	},
	loadMessages: async (id: string) => {
		if (get().unsubscribeMessages !== null) {
			// biome-ignore lint/style/noNonNullAssertion: <I already do null checking>
			for (const unsubscribe of get().unsubscribeMessages!) {
				unsubscribe();
			}
		}

		set({ loading: true, error: null });
		try {
			const unsubscribe = firestore()
				.collection(`chats/${id}/messages`)
				.orderBy("createdAt")
				.limitToLast(LIMIT_MESSAGES)
				.onSnapshot(
					(snapshot) => {
						const messages: Message[] = snapshot.docs.map((doc) => {
							const data = doc.data();
							return {
								id: doc.id,
								content: data.content,
								sender: data.sender, // Fixed typo from senjder
								type: data.type,
								createdAt: data.createdAt,
								updatedAt: data.updatedAt ?? null,
								fileName: data.fileName ?? null,
								fileType: data.fileType ?? null,
							};
						});
						set({ messages, loading: false, chatId: id });
					},
					(error) => {
						set({ error: error.message, loading: false });
					},
				);

			// Store the unsubscribe function
			set({
				unsubscribeMessages: [
					...(get().unsubscribeMessages ?? []),
					unsubscribe,
				],
			});
		} catch (error) {
			set({ error: error, loading: false });
		}
	},
	loadMoreMessages: async (id: string) => {
		const messages = get().messages;

		if (messages.length === 0) {
			return;
		}

		// Get the oldest message (first in array when ordered by createdAt)
		const oldestMessage = messages[0];

		set({ isRefreshing: true, error: null });

		try {
			// Use onSnapshot instead of get() to react to changes in older messages
			const unsubscribe = firestore()
				.collection(`chats/${id}/messages`)
				.orderBy("createdAt")
				.endBefore(oldestMessage.createdAt)
				.limitToLast(LIMIT_MESSAGES)
				.onSnapshot(
					(snapshot) => {
						if (snapshot.empty) {
							set({ isRefreshing: false });
							return;
						}

						const newMessages: Message[] = snapshot.docs.map((doc) => {
							const data = doc.data();
							return {
								id: doc.id,
								content: data.content || "",
								sender: data.sender,
								type: data.type || "text",
								createdAt: data.createdAt,
								updatedAt: data.updatedAt ?? null,
								fileName: data.fileName ?? null,
								fileType: data.fileType ?? null,
							};
						});

						// Get the current messages, but filter out any that are in the new batch
						// to avoid duplicates if a message was both loaded before and again now
						const currentMessages = get().messages.filter(
							(msg) => !newMessages.some((newMsg) => newMsg.id === msg.id),
						);

						// Prepend older messages to the beginning of the array
						set({
							messages: [...newMessages, ...currentMessages],
							isRefreshing: false,
						});
					},
					(error) => {
						console.error("Error listening to more messages:", error);
						set({ error: error, isRefreshing: false });
					},
				);

			// Store the unsubscribe function
			set({
				unsubscribeMessages: [
					...(get().unsubscribeMessages ?? []),
					unsubscribe,
				],
			});
		} catch (error) {
			console.error("Error loading more messages:", error);
			set({ error: error, isRefreshing: false });
		}
	},
	setMessage: (message: string) => {
		set({ currentMessage: message, isTyped: message.trim().length > 0 });
	},
	sendMessage: async () => {
		const userId = firebase.auth().currentUser?.uid;
		const currentMessage = get().currentMessage.trim();
		set({ currentMessage: "", isTyped: false });

		if (!userId || !currentMessage) {
			return;
		}

		try {
			const message: Omit<Message, "id"> = {
				content: currentMessage,
				sender: userId,
				type: "text",
				createdAt: Timestamp.now(),
			};

			await firestore()
				.collection(`chats/${get().chatId}/messages`)
				.add(message);
		} catch (error) {
			console.error("Failed to send message:", error);
		}

		get().flashListRef?.current?.scrollToIndex({
			index: 0,
			animated: true,
		});
		get().updateLastMessageToNow();
	},
	sendPhoto: async (type) => {
		const userId = firebase.auth().currentUser?.uid;

		if (!userId) {
			return;
		}
		let result: ImagePicker.ImagePickerResult;

		if (type === "image")
			result = await ImagePicker.launchImageLibraryAsync({
				quality: 0.7,
				allowsMultipleSelection: true,
				mediaTypes: ["images", "videos"],
			});
		else
			result = await ImagePicker.launchCameraAsync({
				allowsMultipleSelection: true,
			});

		if (result.canceled) {
			return;
		}

		result.assets.map(async (asset, index) => {
			const fileName = asset.fileName;

			const storageRef = firebase
				.storage()
				.ref(`chats/${get().chatId}/${asset.type}s/${fileName}`);

			storageRef
				.putFile(asset.uri, {
					contentType: asset.mimeType,
				})
				.on("state_changed", async (snapshot) => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;

					console.log(`Upload is ${progress}% done`);
					set({ statusOfMessage: progress });

					if (snapshot.state === "success") {
						const downloadURL = await snapshot.ref.getDownloadURL();

						// Send message with the download URL
						const message: Omit<Message, "id"> = {
							content: downloadURL,
							sender: userId,
							type: asset.type as Message["type"],
							createdAt: Timestamp.now(),
						};

						await firebase
							.firestore()
							.collection(`chats/${get().chatId}/messages`)
							.add(message);

						if (index === result.assets.length - 1) {
							get().updateLastMessageToNow();
							set({ statusOfMessage: 0 });
						}
						return;
					}
				});
		});
	},
	sendFile: async () => {
		const userId = firebase.auth().currentUser?.uid;

		if (!userId) {
			return;
		}

		const result = await DocumentPicker.getDocumentAsync({
			type: "*/*",
			multiple: true,
			copyToCacheDirectory: false,
		});

		if (result.canceled) return;

		result.assets.map(async (asset, index) => {
			const fileName = asset.name;
			const storageRef = firebase
				.storage()
				.ref(`chats/${get().chatId}/files/${fileName}`);

			storageRef
				.putFile(asset.uri, {
					contentType: asset.mimeType,
				})
				.on("state_changed", async (snapshot) => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;

					console.log(`Upload is ${progress}% done`);
					set({ statusOfMessage: progress });

					if (snapshot.state === "success") {
						const downloadURL = await snapshot.ref.getDownloadURL();

						// Send message with the download URL
						const message: Omit<Message, "id"> = {
							content: downloadURL,
							sender: userId,
							type: "file",
							createdAt: Timestamp.now(),
							fileName,
							fileType: asset.mimeType,
						};

						await firestore()
							.collection(`chats/${get().chatId}/messages`)
							.add(message);

						if (index === result.assets.length - 1) {
							get().updateLastMessageToNow();
							set({ statusOfMessage: 0 });
						}
						return;
					}
				});
		});
	},
	sendAudio: async (assetUri) => {
		const userId = firebase.auth().currentUser?.uid;

		if (!userId) {
			return;
		}

		const name = assetUri.split("/").pop();
		if (!name) {
			console.error("No name found for audio file");
			return;
		}
		const storageRef = firebase
			.storage()
			.ref(`chats/${get().chatId}/audio/${name}`);

		storageRef.putFile(assetUri).on("state_changed", async (snapshot) => {
			const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

			console.log(`Upload is ${progress}% done`);
			set({ statusOfMessage: progress });

			if (snapshot.state === "success") {
				const downloadURL = await snapshot.ref.getDownloadURL();

				// Send message with the download URL
				const message: Omit<Message, "id"> = {
					content: downloadURL,
					sender: userId,
					type: "audio",
					createdAt: Timestamp.now(),
				};

				await firestore()
					.collection(`chats/${get().chatId}/messages`)
					.add(message);

				get().updateLastMessageToNow();
				set({ statusOfMessage: 0 });
				return;
			}
		});
	},
	sendLocation: async (latitude: number, longitude: number) => {
		const userId = firebase.auth().currentUser?.uid;

		if (!userId) {
			return;
		}

		const locationObject = {
			lat: latitude,
			lng: longitude,
		};

		const message: Omit<Message, "id"> = {
			content: JSON.stringify(locationObject),
			sender: userId,
			type: "location",
			createdAt: Timestamp.now(),
		};

		await firestore().collection(`chats/${get().chatId}/messages`).add(message);

		get().updateLastMessageToNow();
		router.back();
	},
	updateLastMessageToNow: async () => {
		const chatRef = firestore().doc(`chats/${get().chatId}`);
		await chatRef.update({ lastMessageAt: Timestamp.now() });
	},
	deleteMessage: async (message: Message) => {
		try {
			// Delete the message from Firestore
			await firebase
				.firestore()
				.collection(`chats/${get().chatId}/messages`)
				.doc(message.id)
				.delete();

			// If it's not a text message, also delete the file from storage
			if (message.type !== "text" && message.type !== "location") {
				try {
					// Get reference to the file in Firebase Storage from URL
					const storageRef = firebase.storage().refFromURL(message.content);

					// Delete the file
					await storageRef.delete();
					console.log("File deleted from storage:", message.type);
				} catch (storageError) {
					console.error("Error deleting file from storage:", storageError);
					// We still consider the deletion successful even if storage deletion fails
				}
			}

			toast.success(t("chats.message_deleted"));
		} catch (error) {
			console.error("Error deleting message:", error);
			toast.error(t("chats.delete_failed") || "Failed to delete message");
		}
	},
}));
