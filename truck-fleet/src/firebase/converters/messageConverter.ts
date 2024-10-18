import type { Message } from "@/models/message";
import { type FirestoreDataConverter, Timestamp } from "firebase/firestore";

export const messageConverter: FirestoreDataConverter<Message> = {
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
    };
  },
};
