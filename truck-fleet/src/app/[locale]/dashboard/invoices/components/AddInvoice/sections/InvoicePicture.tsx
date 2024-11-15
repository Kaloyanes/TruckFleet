import Image from "next/image";
import React from "react";

export default function InvoicePicture() {
	return (
		<div className="flex flex-row items-center justify-between">
			<Image
				className="aspect-square rounded-lg object-cover"
				src="/kala.jpg"
				width={75}
				height={75}
				alt="Invoice Logo, Company Logo"
			/>
		</div>
	);
}
