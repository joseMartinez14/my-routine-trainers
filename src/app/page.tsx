'use client'
import { Button } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

import { useRouter } from 'next/navigation'
import { getAuth, signInWithPopup, GoogleAuthProvider } from '@firebase/auth'
import firebase_app from '../firebase/config';
import Swal from 'sweetalert2';
import axios from 'axios'


export const getNewerFirebaseToken = async () => {
  const token = localStorage.getItem("myroutine-auth-token-refresh");
  const token_time_str = localStorage.getItem("myroutine-auth-token-time");
  if (!token || !token_time_str) {
    return ""
  }


  const token_time = new Date(token_time_str)

  const now = new Date(); // Current time

  const diffMs = now.getTime() - token_time.getTime(); // Difference in milliseconds
  const diffMinutes = Math.round(diffMs / 60000); // Convert to minutes (1000ms * 60s)

  if (diffMinutes < 1) {
    return token;
  } else {
    //get a new token from firebase
    const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_APIKEY;
    const url = `https://securetoken.googleapis.com/v1/token?key=${API_KEY}`;

    try {
      const response = await axios.post(
        `https://securetoken.googleapis.com/v1/token?key=${API_KEY}`,
        new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: token,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const new_token = response.data.id_token || 'Null token';
      const new_token_refresh = response.data.refresh_token || 'Null token';
      localStorage.setItem('myroutine-auth-token', new_token);
      localStorage.setItem('myroutine-auth-token-refresh', new_token_refresh);
      localStorage.setItem('myroutine-auth-token-time', now.toUTCString() || 'Null token');

      return new_token
    } catch (error) {
      console.error('Error fetching user from token:', error);
      return ""
    }

  }
}


const Home = () => {

  const router = useRouter()
  const auth = getAuth(firebase_app);

  const onClick = async () => {
    const provider = new GoogleAuthProvider();
    try {
      let result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);

      const idToken = await result.user.getIdToken();
      const refreshToken = result.user.refreshToken;

      const get_create_user_d = {
        uuid: result.user.uid,
        name: result.user.displayName,
        email: result.user.email
      }
      await axios.post("/api/auth", get_create_user_d)
        .then((data) => {
          const now = new Date().toUTCString();
          localStorage.setItem('myroutine-auth-token', idToken || 'Null token');
          localStorage.setItem('myroutine-auth-token-refresh', refreshToken || 'Null token');
          localStorage.setItem('myroutine-auth-token-time', now || 'Null token');
          router.push(`/dashboard`)
        })
        .catch((error) => {
          const errorMessage = error.message;
          Swal.fire({
            title: "Login unsuccessful",
            text: `Server error. On user creation`,
            icon: "error"
          });
        });
      //Ahora deberia tirar al dashboard
    } catch (error) {
      Swal.fire({
        title: "Login unsuccessful",
        text: `Google message: ${error}`,
        icon: "error"
      });
    }
  }
  return (
    <Box
      width={"100%"}
      height={"100%"}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Button variant="contained" onClick={onClick}> Google Sign in / sign up </Button>
    </Box>
  )
}

export default Home