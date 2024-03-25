import type { Timestamp } from "firebase/firestore";

export const useGetOrder = (currentDate: Date, orders: any[]) => {


  return computed(() => {
    orders.find((order: any) => {
      let orderDate = (order.realTime as Timestamp).toDate();
      orderDate.setMinutes(0);
      orderDate.setSeconds(0);

      currentDate.setMinutes(0);
      currentDate.setSeconds(0);

      return orderDate.toLocaleString() === currentDate.toLocaleString();
    });
  });
}
