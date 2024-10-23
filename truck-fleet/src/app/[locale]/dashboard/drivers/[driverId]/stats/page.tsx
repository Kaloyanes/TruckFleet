export default async function StatisticsPage(props: { params: Promise<{ driverId: string; locale: string }> }) {
    const params = await props.params;
    return <div>Test {params.driverId}</div>;
}
