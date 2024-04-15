import type { Query } from 'firebase/firestore';
import { collection, query, where } from 'firebase/firestore';

export const useOrders = async (licensePlate: string) => {
  const db = useFirestore();
  const companyId = await useCompanyId();

  if (companyId.value === null) {
    throw new Error('companyId is null');
  }

  if (licensePlate === null) {
    throw new Error('licensePlate is null');
  }

  const orderRef = query(collection(db, 'orders'), where('companyId', '==', "UFhdD6m2OKPGJfzJtYfF"));
  const filteredQuery = (ordersQuery: Query) => {
    return licensePlate === 'all'
      ? ordersQuery
      : query(ordersQuery, where('licensePlate', '==', licensePlate));
  };

  const { data: orders, promise: ordersPromise } = useCollection(filteredQuery(orderRef));

  return { orders, ordersPromise };

}
