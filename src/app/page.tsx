'use client'
import { Button } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

import { useRouter } from 'next/navigation'
import { getAuth, signInWithPopup, GoogleAuthProvider } from '@firebase/auth'
import firebase_app from '../firebase/config';
import Swal from 'sweetalert2';
import axios from 'axios'


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