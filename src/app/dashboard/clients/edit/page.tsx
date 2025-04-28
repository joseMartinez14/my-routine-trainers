import { Suspense } from "react";
import EditClientElement from "./editClient";
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';

interface QueryParams {
    id?: string;
}

const queryRoutines = async (clientID: string | null | undefined) => {
    const cookieStore = cookies();
    const cookieHeader = cookieStore.getAll()
        .map(({ name, value }) => `${name}=${value}`)
        .join('; ');

    const res = await fetch(`${process.env.MY_API_URL}/clientRoutine/${clientID}`, {
        method: 'GET',
        headers: {
            'Cookie': cookieHeader,
            'Content-Type': 'application/json', // Optional, but good practice
        },
        cache: 'no-store',
    });

    if (res.ok) {
        const data = await res.json();
        return data;
    }

    if (res.status === 401) {
        redirect('/home/signin');
    }
    console.error('Error on Overview page.tsx fetch');
    console.error(res.status, res.statusText);
    return null;
}

const queryClient = async (clientID: string | null | undefined) => {
    const cookieStore = cookies();
    const cookieHeader = cookieStore.getAll()
        .map(({ name, value }) => `${name}=${value}`)
        .join('; ');

    const res = await fetch(`${process.env.MY_API_URL}/clients/${clientID}`, {
        method: 'GET',
        headers: {
            'Cookie': cookieHeader,
            'Content-Type': 'application/json', // Optional, but good practice
        },
        cache: 'no-store',
    });

    if (res.ok) {
        const data = await res.json();
        return data;
    }

    if (res.status === 401) {
        redirect('/home/signin');
    }
    console.error('Error on Overview page.tsx fetch');
    console.error(res.status, res.statusText);
    return null;
}

const EditClient = async ({ searchParams }: { searchParams: QueryParams }) => {

    const { id } = searchParams;

    const client = await queryClient(id);
    const routines = await queryRoutines(id);

    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <EditClientElement client={client} routines={routines} />
            </Suspense>
        </div>
    );
}

export default EditClient