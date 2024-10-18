export type Message = {
  id: string;
  type: "text" | "image" | "voice" | "video" | "location";
  content: string;
  createdAt: Date;
  sender: string;
};
