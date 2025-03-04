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
    console.log("Holaa")
    try {
      let result = await signInWithPopup(auth, provider);
      console.log("Pichaaa")
      const token = await result.user.getIdToken();

      localStorage.setItem('myroutine-auth-token', token || 'Null token');
      const api_res = await axios.get("");
      router.push(`/dashboard`)
      //Ahora deberia tirar al dashboard
    } catch (error) {
      Swal.fire({
        title: "Login unsuccessful",
        text: `Google message: ${error}`,
        icon: "error"
      });
    }
    // await signInWithPopup(auth, provider)
    //   .then(async (result) => {
    //     const credential = GoogleAuthProvider.credentialFromResult(result);
    //     const token = credential?.accessToken;
    //     const user = result.user;

    //     localStorage.setItem('myroutine-auth-token', token || 'Null token');
    //     const api_res = await axios.get("");
    //     router.push(`/dashboard`)
    //     //Ahora deberia tirar al dashboard

    //   }).catch((error) => {
    //     const errorMessage = error.message;
    //     Swal.fire({
    //       title: "Login unsuccessful",
    //       text: `Google message: ${errorMessage}`,
    //       icon: "error"
    //     });
    //   });

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