import type { DocumentReference } from "firebase/firestore";

export type Order = {
  status: "Picking Up" | "In Delivery" | "Delivered";
  driver: DocumentReference | undefined;
  truck: DocumentReference | undefined;
  companyId: string;
  company: {
    ref: DocumentReference;
    name: string;
    worker: string;
  };
  palletes: {
    width: number;
    length: number;
    height: number;
    weight: number;
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
};
