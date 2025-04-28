import { Suspense } from "react"
import UpdateExercise from "./ExercisesUpdate"
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';


const queryBodyParts = async () => {
    const cookieStore = cookies();
    const cookieHeader = cookieStore.getAll()
        .map(({ name, value }) => `${name}=${value}`)
        .join('; ');

    const res = await fetch(`${process.env.MY_API_URL}/bodyparts`, {
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

const queryExercise = async (exercise_id: string | null | undefined) => {
    const cookieStore = cookies();
    const cookieHeader = cookieStore.getAll()
        .map(({ name, value }) => `${name}=${value}`)
        .join('; ');

    const res = await fetch(`${process.env.MY_API_URL}/exercises/${exercise_id}`, {
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

const UpdateExercisePage = async ({ searchParams }: { searchParams: QueryParams }) => {

    const { id } = searchParams;
    const bp = await queryBodyParts();
    const exercise = await queryExercise(id);

    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <UpdateExercise bodyPartsList={bp} exercise={exercise} />
            </Suspense>
        </div>

    )
}

export default UpdateExercisePage