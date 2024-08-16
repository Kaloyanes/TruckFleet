import type { DocumentReference, Timestamp } from "firebase/firestore";

export type Order = {
  id: string;
  status: "Picking Up" | "In Delivery" | "Delivered";
  driver: DocumentReference | undefined;
  truck: DocumentReference | undefined;
  companyId: string;
  company: {
    name: string;
    ref: DocumentReference;
    worker: string;
  };
  palletes: {
    height: number;
    length: number;
    weight: number;
    width: number;
  }[];
  pickUps: {
    address: string;
    start: Date;
    end: Date;
  }[];
  deliveries: {
    address: string;
    start: Date;
    end: Date;
  }[];
  documents: File | { name: string; url: string };
  note: string;
  licensePlate: string;
  createdAt: Date;
};
