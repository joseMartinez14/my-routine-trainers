import { cookies } from "next/headers";
import ProfilePage from "./profilePage";
import { redirect } from 'next/navigation';

const queryProfile = async () => {
    const cookieStore = cookies();
    const cookieHeader = cookieStore.getAll()
        .map(({ name, value }) => `${name}=${value}`)
        .join('; ');


    const res = await fetch(`${process.env.MY_API_URL}/profile`, {
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


const Profile = async () => {

    const profile = await queryProfile();

    return (
        <ProfilePage profile={profile} />
    );


}

export default Profile
