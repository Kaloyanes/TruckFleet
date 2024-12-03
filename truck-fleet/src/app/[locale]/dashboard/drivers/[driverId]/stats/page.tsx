export default async function StatisticsPage(props: { params: Promise<{ locale: string; driverId: string }> }) {
    const params = await props.params;

    const {
        locale,
        driverId
    } = params;

    return <div>Test {driverId}</div>;
}
