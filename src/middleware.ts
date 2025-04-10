'use server';

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function middleware(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1]; // Extract token
  const requestHeaders = new Headers(req.headers);

  await query_firebase(token, requestHeaders);

  //Deberia verificar si el usuario existe en la base de datos?
  // sino esta o no exister entonces retorno error tambien
  // const user_on_db = await prisma.trainers.findUnique({where: {id: }})

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
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
  } catch (error) {
    return NextResponse.json({ error: `Authentication failed ${error}` }, { status: 401 });
  }
}
