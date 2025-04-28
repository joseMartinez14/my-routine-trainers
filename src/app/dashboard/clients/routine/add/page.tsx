import { Suspense } from "react"
import AddRoutine from "./AddRoutine"
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';

const queryExercises = async () => {
    const cookieStore = cookies();
    const cookieHeader = cookieStore.getAll()
        .map(({ name, value }) => `${name}=${value}`)
        .join('; ');
    try {
        const res = await fetch(`${process.env.MY_API_URL}/exercises`, {
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
    catch (error: any) {
        console.error(error)
        return [];
    }
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

interface QueryParams {
    id?: string;
}

const AddRoutinePage = async ({ searchParams }: { searchParams: QueryParams }) => {

    const { id } = searchParams;

    const client = await queryClient(id);
    const exercises = await queryExercises();

    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <AddRoutine client={client} exerciseList={exercises} />
            </Suspense>
        </div>
    )
}

export default AddRoutinePage

