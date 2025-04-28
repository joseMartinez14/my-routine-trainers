import { Suspense } from "react";
import EditRoutine from "./EditRoutine";
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';

interface QueryParams {
    routine_id?: string;
}

const queryExercises = async () => {
    const cookieStore = cookies();
    const cookieHeader = cookieStore.getAll()
        .map(({ name, value }) => `${name}=${value}`)
        .join('; ');

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

const queryRoutine = async (id: string | null | undefined) => {
    const cookieStore = cookies();
    const cookieHeader = cookieStore.getAll()
        .map(({ name, value }) => `${name}=${value}`)
        .join('; ');
    const res = await fetch(`${process.env.MY_API_URL}/routines/${id}`, {
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

const EditRoutinePage = async ({ searchParams }: { searchParams: QueryParams }) => {

    const { routine_id } = searchParams;

    const exercises = await queryExercises();
    const routine = await queryRoutine(routine_id);


    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <EditRoutine routine={routine} exerciseList={exercises} />
            </Suspense>
        </div>
    );
}

export default EditRoutinePage

