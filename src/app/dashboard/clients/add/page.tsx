'use client'
import { Box, Button, Card, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useForm } from 'react-hook-form';
import TextInput from '@/app/components/TextInput';
import { maxWidth } from '@mui/system';
import axios from 'axios';
import Swal from 'sweetalert2';
import LoadingModal from '@/app/components/LoadingModal';
import { AddClientForm } from '../type';
import { getNewerFirebaseTokenClient } from '@/utils/authClient';


const AddClient = () => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    const onSubmit = async (data: AddClientForm) => {
        setLoading(true);
        const new_token = await getNewerFirebaseTokenClient()
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
                            <Typography variant="h4">Agregar cliente</Typography>
                        </Stack>
                        <div>

                            <Button onClick={() => { router.push("/dashboard/clients") }} startIcon={<ArrowBackIcon />} variant="contained">
                                Atras
                            </Button>

                        </div>
                    </Stack>
                    <Card sx={{ p: 2, height: '80vh', overflow: 'auto' }}>
                        <TextInput control={control} title='Nombre' value='name' isRequired={true} styles={{ width: '100%', maxWidth: '600px', pt: '10px' }} error={errors?.name ? "This field is required" : undefined} />
                        <TextInput control={control} title='Número telefonico' value='phone' isRequired={true} styles={{ width: '100%', maxWidth: '600px', py: '20px' }} error={errors?.name ? "This field is required" : undefined} />
                        <TextInput control={control} title='Anatomia del cliente' value='anatomy' isRequired={false} styles={{ width: '100%', maxWidth: '600px', py: '20px' }} />
                        <TextInput control={control} title='Lesiones pasadas' value='injuries' isRequired={false} styles={{ width: '100%', maxWidth: '600px', py: '20px' }} />
                        <TextInput control={control} title='Objetivo' value='objective' isRequired={false} styles={{ width: '100%', maxWidth: '600px', py: '20px' }} />
                        <TextInput control={control} title='Experiencia entrenando' value='experience' isRequired={false} styles={{ width: '100%', maxWidth: '600px', py: '20px' }} />
                        <TextInput control={control} title='Cantidad de dias a la semana' value='weeklyTrainingDays' isRequired={true} justNumber={true} styles={{ width: '100%', maxWidth: '600px', py: '20px' }} error={errors?.weeklyTrainingDays ? "This field is required" : undefined} />
                        <TextInput control={control} title='Tiempo para entrenar (Minutos)' value='trainingMinutes' isRequired={true} justNumber={true} styles={{ width: '100%', maxWidth: '600px', py: '20px' }} error={errors?.trainingMinutes ? "This field is required" : undefined} />
                        <Button type="submit" variant="contained" sx={{ maxWidth: '200px' }}>
                            Guardar
                        </Button>

                    </Card>
                </Stack>
            </Box>
        </>

    )
}

export default AddClient