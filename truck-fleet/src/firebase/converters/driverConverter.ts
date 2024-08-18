import type { Driver } from "@/models/driver";
import { type FirestoreDataConverter, Timestamp } from "firebase/firestore";

export const driverConverter: FirestoreDataConverter<Driver> = {
  toFirestore(driver: Driver) {
    return {
      companyId: driver.companyId,
      email: driver.email,
      name: driver.name,
      phoneNumber: driver.phoneNumber,
      photoUrl: driver.photoUrl,
      type: driver.type,
    };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      companyId: data.companyId,
      email: data.email,
      name: data.name,
      phoneNumber: data.phoneNumber,
      photoUrl: data.photoUrl,
      type: data.type,
    };
  },
};