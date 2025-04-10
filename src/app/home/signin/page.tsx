'use client'
import { Box } from '@mui/material'
import React from 'react'
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { FacebookIcon, GoogleIcon, SitemarkIcon } from './components/CustomIcon';
import ForgotPassword from './components/ForgotPassword';
import { getAuth, GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup } from '@firebase/auth';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import firebase_app from '@/firebase/config'
import LoadingModal from '@/app/components/LoadingModal';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));


const Signin = (props: { disableCustomTheme?: boolean }) => {

    const [loading, setLoading] = React.useState<boolean>(false);
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const router = useRouter()

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (emailError || passwordError) {
            event.preventDefault();
            return;
        }
        setLoading(true);
        const data = new FormData(event.currentTarget);
        const auth = getAuth(firebase_app);

        const email = data.get('email') as string;
        const password = data.get('password') as string;


        try {

            let result = await signInWithEmailAndPassword(auth, email, password);

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
            setLoading(false);

            //Ahora deberia tirar al dashboard
        } catch (error) {
            setLoading(false);
            Swal.fire({
                title: "Login unsuccessful",
                text: `Google message: ${error}`,
                icon: "error"
            });
        }

    };

    const handleResetPassword = async (email: string) => {
        try {
            const auth = getAuth();
            await sendPasswordResetEmail(auth, email);
            Swal.fire({
                position: "top-end",
                icon: "info",
                title: "Reset email sent",
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error("Password reset error:", error);
        }
    }

    const handleGoodleLogin = async () => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth(firebase_app);
        setLoading(true);

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
            setLoading(false);

            //Ahora deberia tirar al dashboard
        } catch (error) {
            setLoading(false);
            Swal.fire({
                title: "Login unsuccessful",
                text: `Google message: ${error}`,
                icon: "error"
            });
        }
    }

    const validateInputs = () => {
        const email = document.getElementById('email') as HTMLInputElement;
        const password = document.getElementById('password') as HTMLInputElement;

        let isValid = true;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };


    return (
        <>
            <LoadingModal open={loading} />
            <Box
                width={"100%"}
                height={"100%"}
                sx={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    overflow: 'auto',
                }}
            >
                <CssBaseline enableColorScheme />
                <SignInContainer direction="column" justifyContent="space-between">
                    <Card variant="outlined">
                        <Typography
                            component="h1"
                            variant="h4"
                            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                        >
                            Sign in
                        </Typography>
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            noValidate
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                gap: 2,
                            }}
                        >
                            <FormControl>
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <TextField
                                    error={emailError}
                                    helperText={emailErrorMessage}
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="your@email.com"
                                    autoComplete="email"
                                    autoFocus
                                    required
                                    fullWidth
                                    variant="outlined"
                                    color={emailError ? 'error' : 'primary'}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="password">Password</FormLabel>
                                <TextField
                                    error={passwordError}
                                    helperText={passwordErrorMessage}
                                    name="password"
                                    placeholder="••••••"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    autoFocus
                                    required
                                    fullWidth
                                    variant="outlined"
                                    color={passwordError ? 'error' : 'primary'}
                                />
                            </FormControl>
                            <ForgotPassword open={open} handleClose={handleClose} handleSubmit={handleResetPassword} />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                onClick={validateInputs}
                            >
                                Sign in
                            </Button>
                            <Link
                                component="button"
                                type="button"
                                onClick={handleClickOpen}
                                variant="body2"
                                sx={{ alignSelf: 'center' }}
                            >
                                Forgot your password?
                            </Link>
                        </Box>
                        <Divider>or</Divider>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={handleGoodleLogin}
                                startIcon={<GoogleIcon />}
                            >
                                Sign in with Google
                            </Button>
                            <Typography sx={{ textAlign: 'center' }}>
                                Don&apos;t have an account?{' '}
                                <Link
                                    href="/home/signup"
                                    variant="body2"
                                    sx={{ alignSelf: 'center' }}
                                >
                                    Sign up
                                </Link>
                            </Typography>
                        </Box>
                    </Card>
                </SignInContainer>
            </Box>
        </>
    );
}

export default Signin