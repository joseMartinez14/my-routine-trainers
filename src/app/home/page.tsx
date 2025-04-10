'use client'
import { Button, Slide, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

import { useRouter } from 'next/navigation'
import { getAuth, signInWithPopup, GoogleAuthProvider } from '@firebase/auth'
import Swal from 'sweetalert2';
import axios from 'axios'
import firebase_app from '@/firebase/config'

const HomeLanding = () => {

    const router = useRouter()
    const auth = getAuth(firebase_app);

    const onClick = async () => {
        router.push(`/home/signin`)
    }

    return (
        <Box
            width={"100%"}
            height={"100%"}
            sx={{
                width: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
            }}
        >
            <Box
                sx={{
                    height: "75%",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column'
                }}>
                <Slide appear={true} in={true} timeout={1000 * 3}>
                    <Typography sx={{
                        color: '#ffffff',
                        fontSize: {
                            xs: '35px',
                            sm: '40px',
                            md: '45px',
                            lg: '60px',
                            xl: '60px'
                        },
                        fontWeight: '700',
                        textAlign: 'center',

                    }}>
                        {"My Routine Pro"}
                    </Typography>
                </Slide>
                <Box
                    width={"100%"}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column'
                    }}
                >
                    <Slide appear={true} in={true} timeout={1000 * 3} direction='up'>
                        <Typography sx={{
                            color: '#ffffff',
                            pt: 5,
                            maxWidth: {
                                xs: '85%',
                                sm: '75%',
                                md: '60%',
                            },
                            fontSize: {
                                xs: '20px',
                                sm: '24px',
                                md: '32px',
                            },
                            // fontSize: '32px',
                            fontWeight: '500',
                            textAlign: 'center',

                        }}>
                            {"Gym routines mobile web application for your clients. If you are a fitness trainer this is for you."}
                        </Typography>
                    </Slide>

                    <Button sx={{ mt: 3 }} variant="contained" onClick={onClick}> Let's get Started </Button>

                </Box>


            </Box>
        </Box>
    )
}

export default HomeLanding