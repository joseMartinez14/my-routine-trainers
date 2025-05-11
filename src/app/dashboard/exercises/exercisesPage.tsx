'use client'
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { Card, InputAdornment, OutlinedInput } from '@mui/material';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LoadingModal from '@/app/components/LoadingModal';
import ExercisesTable, { Exercise } from './Components/exercises-table';
import Swal from 'sweetalert2';
import { getNewerFirebaseTokenClient } from '@/utils/authClient';
import axios, { AxiosError } from 'axios';


interface ExercisesPageProps {
    exerciseRows: Exercise[]
}


const ExercisesPage = (props: ExercisesPageProps) => {

    const { exerciseRows } = props;

    const router = useRouter();
    const [filteredExercises, setfilteredExercises] = useState<Exercise[]>(exerciseRows)
    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");

    const [selectedRows, setSelectedRows] = useState<Exercise[]>([]);


    const addSelectedRow = (row: Exercise) => {
        setSelectedRows((prev) => [...prev, row]);
    };

    const removeSelectedRow = (id: string) => {
        setSelectedRows((prev) => prev.filter((row) => row.id !== id));
    };

    const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    }

    const onSearchClick = () => {
        const filteredExercises = exerciseRows.filter(exercise =>
            exercise.name.toLowerCase().includes(search.toLowerCase())
        );
        setfilteredExercises(filteredExercises)
    }



    const onDelete = async (id: string) => {
        let continue_query = true;

        await Swal.fire({
            title: `Eliminar ejercicio con id ${id}?`,
            showDenyButton: true,
            confirmButtonText: "Confirmar",
            denyButtonText: `Cancelar`
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isDenied) {
                Swal.fire("No se eliminó nada", "", "info");
                continue_query = false
            }
        });

        if (!continue_query) return

        const new_token = await getNewerFirebaseTokenClient()

        setLoading(true);
        await axios.delete(`/api/exercises/${id}`, {
            headers: {
                Authorization: `Bearer ${new_token}`,
            },
        })
            .then((res) => {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Ejercicio eliminado",
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .catch((error: AxiosError) => {
                console.error(error)
                Swal.fire({
                    title: "Error",
                    text: `Message: ${error.response?.data}`,
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
            <Stack spacing={3}>
                <Stack direction="row" spacing={3}>
                    <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
                        <Typography variant="h4">Exercises</Typography>
                    </Stack>
                    <div>
                        <Button
                            onClick={() => { onDelete(selectedRows[0].id) }}
                            startIcon={<DeleteOutlinedIcon />}
                            variant="contained"
                            sx={{ mx: 2 }}
                            disabled={!(selectedRows.length == 1)}
                        >
                            Remove
                        </Button>
                        <Button
                            onClick={() => { router.push(`${window.location.pathname}/update?id=${selectedRows[0].id}`) }}
                            startIcon={<EditNoteOutlinedIcon />}
                            variant="contained"
                            disabled={!(selectedRows.length == 1)}
                            sx={{ mx: 2 }}
                        >
                            Edit
                        </Button>

                        <Button
                            onClick={() => { router.push(`${window.location.pathname}/add`) }}
                            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
                            variant="contained"
                            sx={{ mx: 2 }}
                        >
                            Add
                        </Button>


                    </div>
                </Stack>
                <Card sx={{ p: 2 }}>
                    <Stack direction="row" spacing={3}>
                        <OutlinedInput
                            defaultValue=""
                            fullWidth
                            placeholder="Search Exercises"
                            onChange={onSearchChange}
                            startAdornment={
                                <InputAdornment position="start">
                                    <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
                                </InputAdornment>
                            }
                            sx={{ maxWidth: '500px' }}
                        />
                        <Button onClick={onSearchClick} startIcon={<MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
                            Search
                        </Button>
                    </Stack>

                </Card>
                <ExercisesTable
                    count={exerciseRows.length}
                    page={page}
                    rows={filteredExercises}
                    rowsPerPage={rowsPerPage}
                    selectedRows={selectedRows}
                    addSelectedRow={addSelectedRow}
                    removeSelectedRow={removeSelectedRow}
                />
            </Stack>
        </>
    );


}

export default ExercisesPage
