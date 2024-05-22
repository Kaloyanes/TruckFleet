import type { DocumentData } from 'firebase/firestore';
import { collection, query, where } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useOrdersStore = defineStore('myOrdersStore', () => {
  const companyOrders = ref<DocumentData[]>([]);
  const unfilteredCompanyOrders = ref<DocumentData[]>([]);

  if (unfilteredCompanyOrders.value.length < 1) {
    useCompanyId().then(id => {
      const db = useFirestore();
      const orderRef = query(collection(db, 'orders'), where('companyId', '==', id.value));
      const { data: orders } = useCollection(orderRef);

      watch(orders, (value) => {
        companyOrders.value = value;
        unfilteredCompanyOrders.value = value;
      })
    });
  }

  const filterByLicensePlate = (licensePlate: string) => {
    if (licensePlate === 'all') {
      companyOrders.value = unfilteredCompanyOrders.value;
      return;
    }

    companyOrders.value = unfilteredCompanyOrders.value.filter((order) => order.licensePlate === licensePlate);
  };

  return { companyOrders, unfilteredCompanyOrders, filterByLicensePlate };
});
