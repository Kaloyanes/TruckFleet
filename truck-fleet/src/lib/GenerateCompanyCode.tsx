import { updateDoc, type DocumentReference } from "firebase/firestore";
import crypto from "node:crypto";

export async function generateCompanyCode(companyReference: DocumentReference) {
	console.log(companyReference.path);

	const saltToPassword = crypto.randomBytes(255).toString("hex");
	const hash = crypto
		.createHmac("sha512", `kaloyanes.truck.fleet${saltToPassword}`, {})
		.update(companyReference.path)
		.digest("hex");

	await updateDoc(companyReference, {
		companyCode: hash.substring(0, 6),
		saltToPassword,
	});

	return hash.substring(0, 6);
}
