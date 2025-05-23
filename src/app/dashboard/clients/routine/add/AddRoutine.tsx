'use client'
import LoadingModal from '@/app/components/LoadingModal'
import { Autocomplete, Box, Button, Card, Stack, TextField, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { AddRoutineExercise, Client } from '../../type';
import { Exercise, ExerciseRoutineMap } from '@/app/dashboard/exercises/type';
import axios from 'axios';
import Swal from 'sweetalert2';
import DropdownInput from '@/app/components/DropdownInput';
import TextInput from '@/app/components/TextInput';
import RoutineExercisesTable from '../../Components/routine-exercises-table';
import { getNewerFirebaseTokenClient } from '@/utils/authClient';


interface AddRoutineProps {
    client: Client;
    exerciseList: Exercise[];
}

const AddRoutine = (props: AddRoutineProps) => {

    const { client, exerciseList } = props;

    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [routineName, setRoutineName] = useState<string>("");
    const [routineComment, setRoutineComment] = useState<string>("");
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
    const [exerciseRoutineList, setExerciseRoutineList] = useState<ExerciseRoutineMap[]>([])
    const [idCount, setIdCount] = useState<number>(0);

    //==================================
    //Exercise section
    //==================================

    const sortExercises = (obj: ExerciseRoutineMap) => {
        const data = [...exerciseRoutineList, obj]
        setExerciseRoutineList(data.sort((a, b) => a.day - b.day));
    }

    const onSubmit = async (data: AddRoutineExercise) => {
        if (selectedExercise) {
            setSelectedExercise(null)
            sortExercises({
                id: idCount,
                exerciseID: -1,
                routineID: -1,
                day: data.trainingDay,
                reps: data.reps,
                variation: data.variation,
                weight: data.weight,
                exercise: selectedExercise
            });
            setIdCount(idCount + 1)
        }
    }


    const removeSelectedRow = (id: number) => {
        setExerciseRoutineList((prev) => prev.filter((row) => row.id !== id));
    };

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<AddRoutineExercise>();

    const onRoutineSubmit = async () => {

        const token = await getNewerFirebaseTokenClient();

        const data = {
            client_id: client?.id,
            routine_name: routineName,
            routine_comment: routineComment,
            exerciseRoutineMap: exerciseRoutineList
        }
        await axios.post(`/api/routines/`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Routine saved",
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .catch((error => {
                console.error(error)
                Swal.fire({
                    title: "Error",
                    text: `Message: ${error}`,
                    icon: "error"
                });
            }))


    }

    const page = 0;
    const rowsPerPage = 5;

    return (
        <>
            <LoadingModal open={loading} />
            <Stack spacing={3}>
                <Stack direction="row" spacing={3}>
                    <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
                        <Typography variant="h4">{`Add routine for ${client?.name}`}</Typography>
                    </Stack>
                    <div>
                        <Button
                            onClick={() => { router.push(`/dashboard/clients`) }}
                            startIcon={<ArrowBackIcon />}
                            variant="contained"
                            sx={{ mx: 2 }}
                        >
                            Back
                        </Button>
                    </div>
                </Stack>
                <Card sx={{ p: 2 }}>
                    <Stack direction="column" spacing={3}>
                        <Box sx={{ width: '100%', maxWidth: '600px' }}>
                            <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                    fontSize: '18px',
                                    margin: 0,
                                    padding: 0,
                                    fontWeight: 500,
                                }}>
                                {"Name?:"}
                            </Typography>
                            <TextField
                                sx={{
                                    width: '100%',
                                }}
                                inputProps={{
                                    style: {
                                        height: '16px',
                                    },
                                }}
                                onChange={(event) => {
                                    const inputValue: string = event.target.value;
                                    setRoutineName(inputValue)
                                }}
                                value={routineName}
                                variant="outlined"
                            />
                        </Box>
                        <Box sx={{ width: '100%' }}>
                            <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                    fontSize: '18px',
                                    margin: 0,
                                    padding: 0,
                                    fontWeight: 500,
                                }}>
                                {"Comment?:"}
                            </Typography>
                            <TextField
                                sx={{
                                    width: '100%',
                                }}
                                inputProps={{
                                    style: {
                                        height: '16px',
                                    },
                                }}
                                onChange={(event) => {
                                    const inputValue: string = event.target.value;
                                    setRoutineComment(inputValue)
                                }}
                                value={routineComment}
                                variant="outlined"
                                multiline={true}
                            />
                        </Box>
                    </Stack>

                </Card>
                <Box
                    component="form"
                    autoComplete="on"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Card sx={{ p: 2 }}>
                        <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{
                                fontSize: '24px',
                                margin: 0,
                                padding: 0,
                                fontWeight: 700,
                                py: 2
                            }}>
                            {"Add exercise to routine"}
                        </Typography>
                        <Autocomplete
                            options={exerciseList}
                            getOptionLabel={(option) => option.name} // Display name in dropdown
                            value={selectedExercise}
                            onChange={(_, newValue, reason) => {
                                if (reason == 'selectOption')
                                    setSelectedExercise(newValue)
                                if (newValue)
                                    setValue("exerciseID", newValue?.id)
                            }}
                            renderInput={(params) => <TextField {...params} label="Select an exercise" variant="outlined" />}
                            filterOptions={(options, { inputValue }) =>
                                options.filter((option) => option.name.toLowerCase().includes(inputValue.toLowerCase()))
                            }
                        />
                        <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{
                                color: "#d32f2f",
                                fontSize: '0.75rem',
                                margin: 0,
                                padding: 0,
                                fontWeight: 400,
                                lineHeight: '1.66',
                                letterSpacing: '0.03333em',
                                paddingLeft: '15px',
                                paddingTop: '3px',
                            }}>
                            {errors.exerciseID ? "This field is required" : undefined}
                        </Typography>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                            }}>
                            <DropdownInput
                                control={control}
                                title='Training day of the week'
                                value='trainingDay'
                                isRequired={true}
                                styles={{ width: '100%', maxWidth: '240px', pt: '10px' }}
                                data={daysData}
                                error={errors?.trainingDay ? "This field is required" : undefined}
                            />
                            <TextInput
                                control={control}
                                title='Reps'
                                value='reps'
                                isRequired={true}
                                styles={{ width: '100%', maxWidth: '600px', pl: 1.5, pt: '10px' }}
                                error={errors?.name ? "This field is required" : undefined}
                            />

                        </Box>
                        <TextInput control={control} title='Variation?' value='variation' isRequired={false} styles={{ width: '100%', pt: '10px' }} />
                        <TextInput control={control} title='Weight?' value='weight' isRequired={false} styles={{ width: '100%', pt: '10px' }} />
                        <Button type="submit" variant="contained" sx={{ maxWidth: '200px', my: 2 }}>
                            Add exercise
                        </Button>
                    </Card>
                </Box>
                <RoutineExercisesTable
                    title='Routine exercises'
                    count={exerciseRoutineList.length}
                    page={page}
                    rows={exerciseRoutineList}
                    rowsPerPage={rowsPerPage}
                    removeSelectedRow={removeSelectedRow}
                />
                <Button onClick={onRoutineSubmit} variant="contained" sx={{ maxWidth: '200px', my: 2 }}>
                    Submit routine
                </Button>
            </Stack>
        </>
    )
}

export default AddRoutine


const daysData = [
    { id: "1", value: "1" },
    { id: "2", value: "2" },
    { id: "3", value: "3" },
    { id: "4", value: "4" },
    { id: "4", value: "4" },
    { id: "6", value: "6" },
    { id: "7", value: "7" },
]