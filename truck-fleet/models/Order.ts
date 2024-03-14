import type { Timestamp } from "firebase-admin/firestore";

export type Order = {
  addition: null | string;
  addressCode: number;
  avgCourse: number;
  clientRef: null | string;
  clientWorker: string;
  companyId: string;
  companyOrder: string;
  countryCode: string;
  courseNumber: number;
  documentsUrls: string[];
  driver: string;
  fromToMaps: number;
  isDone: boolean;
  isLoaded: boolean;
  orderInCourse: number;
  orderSize: string;
  orderSum: number;
  orderTime: Timestamp;
  orderWeight: number;
  realTime: Timestamp;
  roadCost: number;
  roadCostUTA: number;
  servicedBy: string;
  servicedKm: number;
  speditor: string;
  speditorProfit: number;
  subCourse: number;
  target: number;
  totalKmMaps: number;
  totalRoadCost: number;
  truckWeight: number;
  ETA: Timestamp;
  id: string;
}
