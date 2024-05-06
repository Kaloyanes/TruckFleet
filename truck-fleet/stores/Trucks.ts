import type { DocumentData } from 'firebase/firestore';
import { defineStore } from 'pinia';

export const useTrucksStore = defineStore({
  id: 'myTrucksStore',
  state: () => {
    return { trucks: <DocumentData[]>[], unfilteredTrucks: <DocumentData[]>[], currentFilter: ("All" as String), }
  },

  actions: {
    init() {
      useTrucks().then(x => {
        this.trucks = x.trucks.value;
        this.unfilteredTrucks = x.trucks.value;
      });
    },
    filter(status: String) {
      console.log("truck", status)

      this.currentFilter = status;

      if (status === "All") {
        console.log("all");
        this.trucks = this.unfilteredTrucks;
        return;
      }

      this.trucks = this.unfilteredTrucks.filter(x => x.status == status);

    }
  }
})
