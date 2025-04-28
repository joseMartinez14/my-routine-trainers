import ExercisesPage from "./exercisesPage";
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';

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


const Exercices = async () => {
    const exercises = await queryExercises();

    return (
        <ExercisesPage exerciseRows={exercises} />
    );


}

export default Exercices
