'use client'
import LoadingModal from '@/app/components/LoadingModal';
import { getNewerFirebaseToken } from '@/utils/auth';
import { Box, Button, Stack, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import StatCard from './Components/statCard';
import RoutinesStatTable from './Components/overview-table';
import { RoutineListStat } from '../routines/type';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { useRouter } from 'next/navigation';

const Overview = () => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [countRoutine, setCountRoutines] = useState<number>(0);
    const [countClients, setCountClients] = useState<number>(0);
    const [countExercises, setCountExercises] = useState<number>(0);
    const [routinesRows, setRoutinesRows] = useState<RoutineListStat[]>([])
    const [selectedRow, setSelectedRow] = useState<RoutineListStat | undefined>(undefined);

    const toggleSelected = (row: RoutineListStat) => {
        setSelectedRow(row)
    }
    const queryStats = async () => {
        const token = await getNewerFirebaseToken();
        await axios.get("/api/overview", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                console.log("Holis")
                console.log(res.data)
                setRoutinesRows(res.data.top_routines)
                setCountRoutines(res.data.count_active_routines)
                setCountClients(res.data.count_clients)
                setCountExercises(res.data.count_exercises)

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

    useEffect(() => {
        queryStats();
    }, [])

    const page = 0;
    const rowsPerPage = 5;

    return (
        <>
            <LoadingModal open={loading} />
            <Stack spacing={3}>
                <Stack direction="row" spacing={3}>
                    <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
                        <Typography variant="h4">Overview</Typography>
                    </Stack>
                </Stack>
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-around'
                }}>
                    <StatCard title='Active routines' value={String(countRoutine)} />
                    <StatCard title='# Clients' value={String(countClients)} />
                    <StatCard title='# Exercises' value={String(countExercises)} />
                </Box>

                {/* <Card sx={{ p: 2 }}>
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

                </Card> */}

                <Typography variant="h5" sx={{ pt: 4 }}>
                    {'Oldest active routines'}
                </Typography>
                <Stack direction="row" spacing={3}>
                    <div></div>
                    <div>
                        <Button
                            onClick={() => { router.push(`${window.location.pathname}/edit?id=${selectedRow?.routine_id}`) }}
                            startIcon={<EditNoteOutlinedIcon />}
                            variant="contained"
                            disabled={!selectedRow}
                            sx={{ mx: 2 }}
                        >
                            Edit
                        </Button>
                        <Button
                            onClick={() => { router.push(`/dashboard/clients/routine/add?client_id=${selectedRow?.client_id}`) }}
                            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
                            variant="contained"
                            disabled={!selectedRow}
                            sx={{ mx: 2 }}
                        >
                            Add new
                        </Button>
                    </div>
                </Stack>
                <RoutinesStatTable
                    count={routinesRows.length}
                    page={page}
                    rows={routinesRows}
                    rowsPerPage={rowsPerPage}
                    selectedRow={selectedRow}
                    toggle={toggleSelected}
                />
            </Stack>
        </>
    )
}

export default Overview