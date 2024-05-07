import type { DocumentData } from 'firebase/firestore';
import { collection, query, where, } from 'firebase/firestore';
import { defineStore } from 'pinia';

export const useOrdersStore = defineStore({
  id: 'myOrdersStore',
  state: () => ({
    companyOrders: <DocumentData[]>[],
    unfilteredCompanyOrders: <DocumentData[]>[],

  }),
  actions: {
    async init() {
      if (this.unfilteredCompanyOrders.length) return;

      const id = await useCompanyId();
      const db = useFirestore();

      const orderRef = query(collection(db, 'orders'), where('companyId', '==', id.value));
      // const filteredQuery = (ordersQuery: Query) => {
      //   return licensePlate === 'all'
      //     ? ordersQuery
      //     : query(ordersQuery, where('licensePlate', '==', licensePlate));
      // };

      const { data: orders, promise: ordersPromise } = useCollection(orderRef);

      await ordersPromise.value;

      this.companyOrders = orders.value;
      this.unfilteredCompanyOrders = orders.value;
    },
    filterByLicensePlate(licensePlate: string) {
      console.log(licensePlate);
      if (licensePlate === 'all') {
        this.companyOrders = this.unfilteredCompanyOrders;
        return;
      }


      this.companyOrders = this.unfilteredCompanyOrders.filter((order) => order.licensePlate === licensePlate);
    }
  }
})
