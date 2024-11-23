import type { Chat } from "@/types/chat";
import type {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";

export const chatConverter: FirestoreDataConverter<Chat> = {
  toFirestore(chat: Chat): DocumentData {
    return {
      id: chat.id,
      participants: chat.participants,
      createdAt: chat.createdAt,
      lastMessageAt: chat.lastMessageAt,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): Chat {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      createdAt: data.createdAt,
      lastMessageAt: data.lastMessageAt,
      participants: data.participants,
    };
  },
};
