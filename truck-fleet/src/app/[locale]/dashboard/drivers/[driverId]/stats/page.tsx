export default async function StatisticsPage({
	params: { locale, driverId },
}: { params: { locale: string; driverId: string } }) {
	return <div>Test {driverId}</div>;
}
