import React from "react";

export default function OrdersSlug({ params }: { params: { id: string } }) {
	return <div>{params.id}</div>;
}
