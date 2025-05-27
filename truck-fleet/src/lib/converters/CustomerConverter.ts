import type { Customer } from "@/types/client";
import type { FirestoreDataConverter } from "firebase/firestore";

export const CustomerConverter: FirestoreDataConverter<Customer> = {
  toFirestore: (customer: Customer) => {
    return {
      name: customer.name,
      address: customer.address,
      phone: customer.phone ?? undefined,
      email: customer.email,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      address: data.address,
      phone: data.phone ?? undefined,
      email: data.email,
    };
  },
};
