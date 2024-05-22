import { ref, watch } from 'vue';
// import { useTrucks } from './useTrucks'; // Assuming useTrucks is imported from another file
// import { useFirestore } from './useFirestore'; // Assuming useFirestore is imported from another file
import type { DocumentData, Timestamp } from 'firebase/firestore';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
import { defineStore } from 'pinia';

export const useTrucksStore = defineStore('myTrucksStore', () => {
  const trucks = ref<DocumentData[]>([]);
  const unfilteredTrucks = ref<DocumentData[]>([]);
  const currentFilter = ref('All');


  if (unfilteredTrucks.value.length < 1) {
    useTrucks().then(({ trucks: data }) => {
      trucks.value = data.value.sort((a, b) => (b.createdAt as Timestamp).toMillis() - (a.createdAt as Timestamp).toMillis());
      unfilteredTrucks.value = trucks.value;

      watch(data, (value) => {
        unfilteredTrucks.value = value;
        trucks.value = value;
      });
    });
  }


  const filterByStatus = (status: string) => {
    currentFilter.value = status;
    if (status === 'All') {
      trucks.value = unfilteredTrucks.value;
      return;
    }
    trucks.value = unfilteredTrucks.value.filter(x => x.status.toLowerCase() == status.toLowerCase());
  };

  const filterByLicensePlate = (licensePlate: string) => {
    if (licensePlate === '') {
      trucks.value = unfilteredTrucks.value;
      return;
    }
    trucks.value = unfilteredTrucks.value.filter((truck) => (truck.licensePlate as string).toLowerCase().includes(licensePlate.toLowerCase()));
  };

  const deleteTruck = async (id: string) => {
    if (!id) return;
    try {
      trucks.value = trucks.value.filter((truck) => truck.id !== id);
      const db = useFirestore();
      const truckRef = doc(db, 'trucks', id);
      await deleteDoc(truckRef);
    } catch (e) {
      throw e;
    }
  };

  const createTruck = async (truckInfo: any) => {
    if (!truckInfo) return;
    const db = useFirestore();

    let doc = await addDoc(collection(db, "trucks"), truckInfo);

    truckInfo.id = doc.id;

    trucks.value.push(truckInfo);
  };

  return { trucks, unfilteredTrucks, currentFilter, filterByStatus, filterByLicensePlate, deleteTruck, createTruck };
});
