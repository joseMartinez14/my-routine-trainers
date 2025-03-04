'use server';

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

async function getUserFromToken(idToken: string) {
  const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_APIKEY;
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`;
  console.log('url: ', url);

  try {
    const response = await axios.post(
      url,
      { idToken: idToken }, // Send the ID token in the request body
      { headers: { 'Content-Type': 'application/json' } }
    );

    return response.data.users?.[0] || null; // Return the first user object
  } catch (error) {
    console.error('Error fetching user from token:', error);
    throw error;
  }
}

export async function middleware(req: NextRequest) {
  console.log('On middleware');
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1]; // Extract token
  const requestHeaders = new Headers(req.headers);
  console.log('Token ', token);

  await query_firebase(token, requestHeaders);

  //awsit query_prisma_db
  //tengo que mandarlo y que devuelva la informacion del trainer
  // sino esta o no exister entonces retorno error tambien

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/api/:path*'],
};

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
