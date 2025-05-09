import type { Driver } from "@/types/driver";
import { type FirestoreDataConverter, Timestamp } from "firebase/firestore";

export const DriverConverter: FirestoreDataConverter<Driver> = {
  toFirestore(driver: Driver) {
    return {
      companyId: driver.companyId,
      email: driver.email,
      name: driver.name,
      phone: driver.phone,
      photoUrl: driver.photoUrl,
      type: driver.type,
      location: driver.location,
    };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      companyId: data.companyId,
      email: data.email,
      name: data.name,
      phone: data.phone,
      photoUrl: data.photoUrl,
      type: data.type,
      address: data.address,
      location: data.location,
    };
  },
};
