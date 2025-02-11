import type { Truck } from "@/types/truck";
import { type FirestoreDataConverter, Timestamp } from "firebase/firestore";

export const TruckConverter: FirestoreDataConverter<Truck> = {
  toFirestore(truck: Truck) {
    return {
      id: truck.id,
      capacity: truck.capacity,
      licensePlate: truck.licensePlate,
      model: truck.model,
      status: truck.status,
      year: truck.year,
      createdAt: Timestamp.fromDate(truck.createdAt),
    };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      capacity: data.capacity,
      licensePlate: data.licensePlate,
      model: data.model,
      status: data.status,
      year: data.year,
      createdAt: data.createdAt.toDate(),
    };
  },
};
