import type { Message } from "@/types/message";
import { type FirestoreDataConverter, Timestamp } from "firebase/firestore";

export const MessageConverter: FirestoreDataConverter<Message> = {
  toFirestore(message: Message) {
    return {
      content: message.content,
      createdAt: Timestamp.fromDate(message.createdAt),
      sender: message.sender,
      type: message.type,
    };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      content: data.content,
      createdAt: new Date((data.createdAt as Timestamp).seconds * 1000),
      sender: data.sender,
      type: data.type,
      updatedAt: data.updatedAt
        ? new Date((data.updatedAt as Timestamp).seconds * 1000)
        : null,
      fileName: data.fileName,
      fileType: data.fileType,
    };
  },
};
