import React from 'react';
import ExercisesPage from "./exercisesPage";
import { cookies, headers } from "next/headers";
import { redirect } from 'next/navigation';
import type { Exercise as APIExercise } from './type';

const queryExercises = async (): Promise<APIExercise[] | null> => {
    const cookieStore = cookies();
    const cookieHeader = cookieStore.getAll()
        .map(({ name, value }) => `${name}=${value}`)
        .join('; ');

    // Get the current host from headers
    const headersList = headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

    const res = await fetch(`${protocol}://${host}/api/exercises`, {
        method: 'GET',
        headers: {
            'Cookie': cookieHeader,
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });

    if (res.ok) {
        return await res.json() as APIExercise[];
    }

    if (res.status === 401) {
        redirect('/home/signin');
    }

    return null;
}

export default async function Exercises(): Promise<React.JSX.Element> {
    const exercises = await queryExercises();

    return (
        // @ts-expect-error: Type mismatch between API Exercise and Table Exercise types
        <ExercisesPage exerciseRows={exercises || []} />
    );
}
