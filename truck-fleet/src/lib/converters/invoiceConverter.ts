import type { Invoice } from "@/types/invoice";
import type {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";
import type { Timestamp } from "firebase/firestore";

export const invoiceConverter: FirestoreDataConverter<Invoice> = {
  toFirestore: (invoice: Invoice) => {
    return invoice;
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): Invoice => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      invoiceNumber: data.invoiceNumber,
      issueDate: (data.issueDate as Timestamp).toDate(),
      dueDate: (data.dueDate as Timestamp).toDate(),
      from: data.from,
      to: data.to,
      items: data.items,
      logo: data.logo,
      vat: data.vat,
      bankDetails: data.bankDetails,
      note: data.note,
      discount: data.discount,
      dealDetails: data.dealDetails,
      createdAt: (data.createdAt as Timestamp).toDate(),
      status: data.status,
      total: data.total,
      currencyCode: data.currencyCode,
      dateFormat: data.dateFormat,
    };
  },
};
