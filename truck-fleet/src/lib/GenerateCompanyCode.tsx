"use server";
import { updateDoc, type DocumentReference } from "firebase/firestore";
import crypto from "node:crypto";

export async function generateCompanyCode(companyRefernce: DocumentReference) {
	console.log(companyRefernce.path);

	const saltToPassword = crypto.randomBytes(255).toString("hex");
	const hash = crypto
		.createHmac("sha256", `kaloyanes.truck.fleet${saltToPassword}`, {})
		.update(companyRefernce.path)
		.digest("hex");

	await updateDoc(companyRefernce, {
		companyCode: hash.substring(0, 6),
		saltToPassword,
	});

	return hash.substring(0, 6);
}
