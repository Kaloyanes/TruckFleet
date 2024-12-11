import type { Company } from "@/types/company";
import type {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";

export const CompanyConverter: FirestoreDataConverter<Company> = {
  toFirestore(company: Company): DocumentData {
    return {
      name: company.name,
      rating: company.rating,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): Company {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      rating: data.rating,
      email: data.email,
    };
  },
};
