'use client'
import { Box, Button, Card, Stack, Typography } from '@mui/material'
import React from 'react'
import { useRouter } from 'next/navigation';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useForm } from 'react-hook-form';
import { AddClientForm } from './type';
import TextInput from '@/app/components/TextInput';
import { maxWidth } from '@mui/system';
import axios from 'axios';

const AddClient = () => {
    const router = useRouter();

    const onSubmit = async (data: AddClientForm) => {
        console.log("On submit for add client")
        console.log(data)
        await axios.post("/api/clients", data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("myroutine-auth-token")}`,
            },
        })
            .then((res) => { console.log("Si funciono el submit por alguna rara razon") })
            .catch((error) => {
                console.log("Ok no funciono good ---")
                console.error(error)
            })
    }

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<AddClientForm>();

    return (
        <Box
            component="form"
            autoComplete="on"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Stack spacing={3}>
                <Stack direction="row" spacing={3}>
                    <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
                        <Typography variant="h4">Add client</Typography>
                    </Stack>
                    <div>
                        <Button onClick={() => { router.push("/dashboard/clients") }} startIcon={<ArrowBackIcon />} variant="contained">
                            Back
                        </Button>
                    </div>
                </Stack>
                <Card sx={{ p: 2 }}>
                    <TextInput control={control} title='Insert client name' value='name' isRequired={true} styles={{ width: '100%', maxWidth: '600px', pt: '10px' }} error={errors?.name ? "Inserte el nombre" : undefined} />
                    <TextInput control={control} title='Insert client phone number' value='phone' isRequired={true} styles={{ width: '100%', maxWidth: '600px', py: '20px' }} error={errors?.name ? "Inserte el telefono" : undefined} />
                </Card>
                <Button type="submit" variant="contained" sx={{ maxWidth: '200px' }}>
                    Submit
                </Button>
            </Stack>
        </Box>

    )
}

export default AddClient