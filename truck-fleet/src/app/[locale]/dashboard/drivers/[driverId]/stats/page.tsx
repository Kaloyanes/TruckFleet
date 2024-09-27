export default function StatisticsPage({
	params,
}: { params: { driverId: string; locale: string } }) {
	return <div>Test {params.driverId}</div>;
}
