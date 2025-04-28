'use server';

import { cookies } from 'next/headers';
import axios from 'axios';

// export const getNewerFirebaseToken = async () => {
//   const cookieStore = cookies();

//   console.log('***** mierda de vida *******');
//   const token = cookieStore.get('myroutine-auth-token-refresh')?.value;
//   const token_time_str = cookieStore.get('myroutine-auth-token-time')?.value;
//   if (!token || !token_time_str) {
//     return '';
//   }

//   const token_time = new Date(token_time_str);

//   const now = new Date(); // Current time

//   const diffMs = now.getTime() - token_time.getTime(); // Difference in milliseconds
//   const diffMinutes = Math.round(diffMs / 60000); // Convert to minutes (1000ms * 60s)

//   if (diffMinutes < 50) {
//     return token;
//   } else {
//     //get a new token from firebase
//     const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_APIKEY;

//     try {
//       const response = await axios.post(
//         `https://securetoken.googleapis.com/v1/token?key=${API_KEY}`,
//         new URLSearchParams({
//           grant_type: 'refresh_token',
//           refresh_token: token,
//         }),
//         {
//           headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//           },
//         }
//       );
//       const new_token = response.data.id_token || 'Null token';
//       const new_token_refresh = response.data.refresh_token || 'Null token';

//       cookieStore.set('myroutine-auth-token', new_token, { path: '/', maxAge: 3600 });
//       cookieStore.set('myroutine-auth-token-refresh', new_token_refresh, { path: '/', maxAge: 3600 });
//       cookieStore.set('myroutine-auth-token-time', now.toUTCString() || 'Null token', { path: '/', maxAge: 3600 });

//       return new_token;
//     } catch (error) {
//       console.error('Error fetching user from token:', error);
//       return '';
//     }
//   }
// };
