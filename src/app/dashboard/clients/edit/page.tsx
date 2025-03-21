'use client'
import { Box, Button, Card, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import TextInput from '@/app/components/TextInput';
import axios from 'axios';
import Swal from 'sweetalert2';
import LoadingModal from '@/app/components/LoadingModal';
import { AddClientForm, Client } from '../type';
import { getNewerFirebaseToken } from '@/utils/auth';
import { ClientRoutineStat } from '@/app/api/routines/type';
import RoutinesTable from '../Components/routines-tables';


const EditClient = () => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [clientID, setClientID] = useState<string | null>(null);
    const [routines, setRoutines] = useState<ClientRoutineStat[]>([]);
    const searchParams = useSearchParams();

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<AddClientForm>();

    useEffect(() => {
        const client_id = searchParams.get('id');
        if (!client_id) router.push("/dashboard/clients")
        else {
            queryClient(client_id);
            queryRoutines(client_id);
            setClientID(client_id);
        }


    }, []);

    const queryRoutines = async (id: string) => {
        setLoading(true);

        const token = await getNewerFirebaseToken();
        await axios.get(`/api/routines/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                const data: ClientRoutineStat[] = res.data;
                setRoutines(data)
            })
            .catch((error => {
                console.error(error)
                Swal.fire({
                    title: "Error",
                    text: `Message: ${error}`,
                    icon: "error"
                });
            }))
        setLoading(false);
    }

    const queryClient = async (id: string) => {
        setLoading(true);

        const token = await getNewerFirebaseToken();
        await axios.get(`/api/clients/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                const data: Client = res.data;
                setValue("name", data.name);
                setValue("phone", data.phone);
                setValue("anatomy", data.anatomy);
                setValue("injuries", data.injuries);
                setValue("objective", data.objective);
                setValue("experience", data.experience);
                setValue("weeklyTrainingDays", data.weeklyTrainingDays);
                setValue("trainingMinutes", data.trainingMinutes);
            })
            .catch((error => {
                console.error(error)
                Swal.fire({
                    title: "Error",
                    text: `Message: ${error}`,
                    icon: "error"
                });
            }))
        setLoading(false);
    }

    const onSubmit = async (data: AddClientForm) => {

        let continue_query = true;

        await Swal.fire({
            title: "Do you want to save the changes?",
            showDenyButton: true,
            confirmButtonText: "Save",
            denyButtonText: `Don't save`
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isDenied) {
                Swal.fire("Changes are not saved", "", "info");
                continue_query = false
            }
        });

        if (!continue_query) return

        const client_id = searchParams.get('id');
        if (!client_id) router.push("/dashboard/clients")

        setLoading(true);


        const new_token = await getNewerFirebaseToken()
        await axios.put(`/api/clients/${client_id}`, data, {
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

    const page = 0;
    const rowsPerPage = 5;

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
                            <Typography variant="h4">{watch("name")}</Typography>
                        </Stack>
                        <div>
                            <Button
                                onClick={() => { router.push(`/dashboard/clients/routine/add?client_id=${clientID}`) }}
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

                    <RoutinesTable
                        title='Routines'
                        count={routines.length}
                        page={page}
                        rows={routines}
                        rowsPerPage={rowsPerPage}
                    />

                    <Card sx={{ p: 2 }}>
                        <TextInput control={control} title='Name' value='name' isRequired={true} styles={{ width: '100%', maxWidth: '600px', pt: '10px' }} error={errors?.name ? "This field is required" : undefined} disabled />
                        <TextInput control={control} title='Phone number' value='phone' isRequired={true} styles={{ width: '100%', maxWidth: '600px', py: '20px' }} error={errors?.name ? "This field is required" : undefined} />
                        <TextInput control={control} title='Client anatomy' value='anatomy' isRequired={false} styles={{ width: '100%', maxWidth: '600px', py: '20px' }} />
                        <TextInput control={control} title='Past injuries' value='injuries' isRequired={false} styles={{ width: '100%', maxWidth: '600px', py: '20px' }} />
                        <TextInput control={control} title='Objective' value='objective' isRequired={false} styles={{ width: '100%', maxWidth: '600px', py: '20px' }} />
                        <TextInput control={control} title='Training experience' value='experience' isRequired={false} styles={{ width: '100%', maxWidth: '600px', py: '20px' }} />
                        <TextInput control={control} title='Training days a week' value='weeklyTrainingDays' isRequired={true} justNumber={true} styles={{ width: '100%', maxWidth: '600px', py: '20px' }} error={errors?.weeklyTrainingDays ? "This field is required" : undefined} />
                        <TextInput control={control} title='Training time in minutes' value='trainingMinutes' isRequired={true} justNumber={true} styles={{ width: '100%', maxWidth: '600px', py: '20px' }} error={errors?.trainingMinutes ? "This field is required" : undefined} />
                    </Card>
                    <Button type="submit" variant="contained" sx={{ maxWidth: '200px' }}>
                        Submit changes
                    </Button>
                </Stack>
            </Box>
        </>

    )
}

export default EditClient