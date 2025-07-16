import React from 'react';
import { cookies, headers } from "next/headers";
import OverviewPage from "./OverviewPage";
import { redirect } from 'next/navigation';
import type { OverviewStats } from '@/app/api/overview/type';

const queryStats = async (): Promise<OverviewStats | null> => {
    const cookieStore = cookies();
    const cookieHeader = cookieStore.getAll()
        .map(({ name, value }) => `${name}=${value}`)
        .join('; ');

    // Get the current host from headers
    const headersList = headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

    const res = await fetch(`${protocol}://${host}/api/overview`, {
        method: 'GET',
        headers: {
            'Cookie': cookieHeader,
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });

    if (res.ok) {
        return await res.json() as OverviewStats;
    }

    if (res.status === 401) {
        redirect('/home/signin');
    }

    return null;
}

export default async function Overview(): Promise<React.JSX.Element> {
    const stats = await queryStats();

    return (
        <OverviewPage stats={stats} />
    );
}