"use client";
import { db } from "@/firebase/firebase";
import { collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
export default function Home() {
  const [snapshot, loading] = useCollection(collection(db, "companies"));

  return (
    <main>
      <h1>Truck Fleet</h1>
      {loading && <p>Loading...</p>}
      {snapshot?.docs.map((doc) => {
        const data = doc.data();
        return (
          <article key={doc.id}>
            <h2>{data.name}</h2>
            <h2>{data.rating}</h2>
          </article>
        );
      })}
    </main>
  );
}
