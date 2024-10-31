export type Message = {
  id: string;
  type: "text" | "image" | "audio" | "video" | "location";
  content: string;
  createdAt: Date;
  sender: string;
  updatedAt: Date | null;
};
