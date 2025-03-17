'use client'
import { Box, Button, Card, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useForm } from 'react-hook-form';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import TextInput from '@/app/components/TextInput';
import { maxWidth } from '@mui/system';
import axios from 'axios';
import Swal from 'sweetalert2';
import LoadingModal from '@/app/components/LoadingModal';
import { AddClientForm } from '../type';
import { getNewerFirebaseToken } from '@/utils/auth';


const EditClient = () => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    const onSubmit = async (data: AddClientForm) => {
        setLoading(true);
        const new_token = await getNewerFirebaseToken()
        await axios.post("/api/clients", data, {
            headers: {
                Authorization: `Bearer ${new_token}`,
            },
        })
            .then((res) => {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Client saved",
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .catch((error) => {
                console.error(error)
                Swal.fire({
                    title: "Error",
                    text: `Message: ${error}`,
                    icon: "error"
                });
            })
        setLoading(false);

    }

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<AddClientForm>();

    return (
        <>
            <LoadingModal open={loading} />
            <Box
                component="form"
                autoComplete="on"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Stack spacing={3}>
                    <Stack direction="row" spacing={3}>
                        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
                            <Typography variant="h4">{"<El nombre del cliente>"}</Typography>
                        </Stack>
                        <div>
                            <Button
                                onClick={() => { router.push(`/dashboard/clients/routine/add`) }}
                                startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
                                variant="contained"
                                sx={{ mx: 2 }}
                            >
                                Add routine
                            </Button>
                            <Button
                                onClick={() => { router.push("/dashboard/clients") }}
                                startIcon={<ArrowBackIcon />}
                                variant="contained"
                                sx={{ mx: 2 }}
                            >
                                Back
                            </Button>
                        </div>
                    </Stack>
                    <Card sx={{ p: 2 }}>
                        <TextInput control={control} title='Name' value='name' isRequired={true} styles={{ width: '100%', maxWidth: '600px', pt: '10px' }} error={errors?.name ? "This field is required" : undefined} />
                        <TextInput control={control} title='Phone number' value='phone' isRequired={true} styles={{ width: '100%', maxWidth: '600px', py: '20px' }} error={errors?.name ? "This field is required" : undefined} />
                        <TextInput control={control} title='Client anatomy' value='anatomy' isRequired={false} styles={{ width: '100%', maxWidth: '600px', py: '20px' }} />
                        <TextInput control={control} title='Past injuries' value='injuries' isRequired={false} styles={{ width: '100%', maxWidth: '600px', py: '20px' }} />
                        <TextInput control={control} title='Objective' value='objective' isRequired={false} styles={{ width: '100%', maxWidth: '600px', py: '20px' }} />
                        <TextInput control={control} title='Training experience' value='experience' isRequired={false} styles={{ width: '100%', maxWidth: '600px', py: '20px' }} />
                        <TextInput control={control} title='Training days a week' value='weeklyTrainingDays' isRequired={true} justNumber={true} styles={{ width: '100%', maxWidth: '600px', py: '20px' }} error={errors?.weeklyTrainingDays ? "This field is required" : undefined} />
                        <TextInput control={control} title='Training time in minutes' value='trainingMinutes' isRequired={true} justNumber={true} styles={{ width: '100%', maxWidth: '600px', py: '20px' }} error={errors?.trainingMinutes ? "This field is required" : undefined} />
                    </Card>
                    <Button type="submit" variant="contained" sx={{ maxWidth: '200px' }}>
                        Submit
                    </Button>
                </Stack>
            </Box>
        </>

    )
}

export default EditClient