import type { Order } from "@/types/orders";
import {
  type FirestoreDataConverter,
  type DocumentData,
  Timestamp,
} from "firebase/firestore";

export const OrderConverter: FirestoreDataConverter<Order> = {
  toFirestore(order: Order): DocumentData {
    const {
      status,
      driver,
      truck,
      company,
      palletes,
      pickUps,
      deliveries,
      documents,
      note,
      companyId,
      createdAt,
      licensePlate,
    } = order;

    const formattedPickUps = pickUps.map(
      (pickup: { address: string; start: Date; end: Date }) => ({
        ...pickup,
        start: Timestamp.fromDate(pickup.start),
        end: Timestamp.fromDate(pickup.end),
      }),
    );

    const formattedDeliveries = deliveries.map(
      (delivery: { address: string; start: Date; end: Date }) => ({
        ...delivery,
        start: Timestamp.fromDate(delivery.start),
        end: Timestamp.fromDate(delivery.end),
      }),
    );

    return {
      companyId,
      status,
      driver,
      truck,
      company: {
        ref: company.ref.path,
        name: company.name,
        worker: company.worker,
      },
      palletes,
      pickUps: formattedPickUps,
      deliveries: formattedDeliveries,
      documents,
      note,
      createdAt: Timestamp.fromDate(createdAt),
      licensePlate,
    };
  },

  fromFirestore(snapshot, options): Order {
    const data = snapshot.data(options);
    const {
      status,
      driver,
      truck,
      company,
      palletes,
      pickUps,
      deliveries,
      documents,
      note,
      companyId,
      licensePlate,
      createdAt,
    } = data;

    const formattedPickUps = pickUps.map(
      (pickup: { address: string; start: Timestamp; end: Timestamp }) => ({
        ...pickup,
        start: pickup.start.toDate(),
        end: pickup.end.toDate(),
      }),
    );

    const formattedDeliveries = deliveries.map(
      (delivery: { address: string; start: Timestamp; end: Timestamp }) => ({
        ...delivery,
        start: delivery.start.toDate(),
        end: delivery.end.toDate(),
      }),
    );

    let formattedDocuments: any;
    if (typeof documents === "object" && documents.name && documents.url) {
      formattedDocuments = documents;
    } else {
      formattedDocuments = null;
    }

    console.log("driver", driver);
    return {
      id: snapshot.id,
      companyId,
      status,
      driver, // Ensure driver is valid
      truck, // Ensure truck is valid
      company: {
        ref: company.ref,
        name: company.name,
        worker: company.worker,
      },
      palletes,
      pickUps: formattedPickUps,
      deliveries: formattedDeliveries,
      documents: formattedDocuments,
      note,
      createdAt: createdAt.toDate(),
      licensePlate,
    };
  },
};
