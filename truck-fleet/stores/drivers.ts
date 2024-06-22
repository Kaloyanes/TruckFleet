import type { DocumentData } from "firebase/firestore";
import { collection, query, where } from "firebase/firestore";
import { defineStore } from "pinia";

export const useMyDriversStore = defineStore("myDriversStore", () => {
  const companyDrivers = ref<DocumentData[]>([]);
  const unfilteredCompanyDrivers = ref<DocumentData[]>([]);

  if (companyDrivers.value.length < 1) {
    useCompanyId().then((id) => {
      const db = useFirestore();
      const orderRef = query(
        collection(db, "users"),
        where("companyId", "==", id.value),
        where("type", "==", "driver"),
      );
      const { data: orders } = useCollection(orderRef);

      watch(orders, (value) => {
        companyDrivers.value = value;
        unfilteredCompanyDrivers.value = value;
      });
    });
  }

  return { companyDrivers, unfilteredCompanyDrivers };
});
