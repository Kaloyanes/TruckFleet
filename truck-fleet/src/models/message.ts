export type Message = {
  id: string;
  type: "text" | "image" | "audio" | "video" | "location" | "file";
  content: string;
  createdAt: Date;
  sender: string;
  updatedAt: Date | null;
  fileName?: string;
  fileType?: string;
};
