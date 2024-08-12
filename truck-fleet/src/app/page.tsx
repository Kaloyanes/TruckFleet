"use client";
import { ThemeToggle } from "@/components/theme-toggle";
import { db } from "@/firebase/firebase";
import { collection } from "firebase/firestore";
import {
	useCollection,
	useCollectionOnce,
} from "react-firebase-hooks/firestore";

export default function Home() {
	const [snapshot, loading] = useCollectionOnce(collection(db, "companies"));

	return (
		<main>
			<div className="absolute top-5 right-5">
				<ThemeToggle />
			</div>
			<h1>Truck Fleet</h1>
			{loading ? (
				<p>Loading...</p>
			) : (
				snapshot?.docs.map((doc) => {
					const data = doc.data();
					return (
						<article key={doc.id}>
							<h2>{data.name}</h2>
							<h2>{data.rating}</h2>
						</article>
					);
				})
			)}
		</main>
	);
}
