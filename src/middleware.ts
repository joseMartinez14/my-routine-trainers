'use server';

import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function middleware(req: NextRequest) {
  const cookieStore = cookies();

  let token = cookieStore.get('myroutine-auth-token')?.value;
  let token_refresh = cookieStore.get('myroutine-auth-token-refresh')?.value;
  const token_time_str = cookieStore.get('myroutine-auth-token-time')?.value;
  if (!token || !token_time_str || !token_refresh) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const next_response = NextResponse.next();

  //Si es muy viejo

  const token_time = new Date(token_time_str);

  const now = new Date(); // Current time

  const diffMs = now.getTime() - token_time.getTime(); // Difference in milliseconds
  const diffMinutes = Math.round(diffMs / 60000); // Convert to minutes (1000ms * 60s)

  if (diffMinutes > 50) {
    //get a new token from firebase
    const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_APIKEY;

    try {
      const response = await axios.post(
        `https://securetoken.googleapis.com/v1/token?key=${API_KEY}`,
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: token_refresh,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      const new_token = response.data.id_token || 'Null token';
      const new_token_refresh = response.data.refresh_token || 'Null token';

      next_response.cookies.set('myroutine-auth-token', new_token, { path: '/', maxAge: 3600 });
      next_response.cookies.set('myroutine-auth-token-refresh', new_token_refresh, { path: '/', maxAge: 3600 });
      next_response.cookies.set('myroutine-auth-token-time', now.toUTCString() || 'Null token', {
        path: '/',
        maxAge: 3600,
      });
      token = new_token;
    } catch (error) {
      console.error('Error fetching user from token:', error);
      return '';
    }
  }

  const requestHeaders = new Headers(req.headers);

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized, missing token' }, { status: 401 });
  }
  const details = await query_firebase(token, requestHeaders);

  if (details instanceof NextResponse) {
    return details;
  }

  //Deberia verificar si el usuario existe en la base de datos?
  // sino esta o no exister entonces retorno error tambien
  // const user_on_db = await prisma.trainers.findUnique({where: {id: }})

  next_response.headers.set('Trainer-Name', details.name);
  next_response.headers.set('Trainer-ID', details.id);

  return next_response;
}

export const config = {
  matcher: [
    '/api/clients/:path*',
    '/api/exercises/:path*',
    '/api/routines/:path*',
    '/api/profile/:path*',
    '/api/overview/:path*',
  ],
};

async function getUserFromToken(idToken: string) {
  const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_APIKEY;
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`;

  try {
    const response = await axios.post(
      url,
      { idToken: idToken }, // Send the ID token in the request body
      { headers: { 'Content-Type': 'application/json' } }
    );

    return response.data.users?.[0] || null; // Return the first user object
  } catch (error) {
    return null;
  }
}

async function query_firebase(token: string, requestHeaders: Headers) {
  try {
    // Validate token and retrieve user info
    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    // Modify request headers to include user info
    requestHeaders.set('Trainer-Name', user.displayName); // Pass user name
    requestHeaders.set('Trainer-ID', user.localId); // Pass user ID

    return { name: user.displayName, id: user.localId };
  } catch (error) {
    return NextResponse.json({ error: `Authentication failed ${error}` }, { status: 401 });
  }
}
