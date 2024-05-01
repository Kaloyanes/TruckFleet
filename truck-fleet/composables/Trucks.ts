import { collection, query, where } from 'firebase/firestore';

export const useTrucks = async () => {
  const firestore = useFirestore();
  const companyId = await useCompanyId();

  const {
    data: trucks,
    promise: trucksPromise,
    pending: trucksPending,

  } = useCollection(
    query(collection(firestore, 'trucks'), where('companyId', '==', companyId.value))
  );

  await trucksPromise.value;

  return { trucks, trucksPending };
}
