import { cookies } from "next/headers";
import OverviewPage from "./OverviewPage";
import { redirect } from 'next/navigation';

const queryStats = async () => {
    const cookieStore = cookies();
    const cookieHeader = cookieStore.getAll()
        .map(({ name, value }) => `${name}=${value}`)
        .join('; ');

    const res = await fetch(`${process.env.MY_API_URL}/overview`, {
        method: 'GET',
        headers: {
            'Cookie': cookieHeader,
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });

    if (res.ok) {
        return await res.json();
    }

    if (res.status === 401) {
        redirect('/home/signin');
    }
    console.error('Error on Overview page.tsx fetch');
    console.error(res.status, res.statusText);
    return null;
}
const Overview = async () => {
    const stats = await queryStats();

    return (
        <OverviewPage stats={stats} />
    )
}

export default Overview