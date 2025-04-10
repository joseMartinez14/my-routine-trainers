'use client'
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { Card, InputAdornment, OutlinedInput } from '@mui/material';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import LoadingModal from '@/app/components/LoadingModal';
import { getNewerFirebaseToken } from '@/utils/auth';
import { RoutineListStat } from './type';
import RoutinesStatTable from './Components/routines-stat-table';




const RoutinesLanding = () => {

    const router = useRouter();
    const [routinesRows, setRoutinesRows] = useState<RoutineListStat[]>([])
    const [filteredRoutines, setFilteredRoutines] = useState<RoutineListStat[]>([])
    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const [selectedRow, setSelectedRow] = useState<RoutineListStat | undefined>(undefined);

    const toggleSelected = (row: RoutineListStat) => {
        setSelectedRow(row)
    }

    const queryClients = async () => {
        setLoading(true);

        const token = await getNewerFirebaseToken();
        await axios.get("/api/routines", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                setRoutinesRows(res.data)
                setFilteredRoutines(res.data)
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

    const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    }

    const onSearchClick = () => {
        const filtered = routinesRows.filter(routine =>
            routine.routine_name?.toLowerCase().includes(search.toLowerCase()) ||
            routine.client_name.includes(search) // Optionally filter by phone number as well
        );
        setFilteredRoutines(filtered)
    }

    useEffect(() => {
        queryClients();
    }, [])

    const page = 0;
    const rowsPerPage = 5;
    return (
        <>
            <LoadingModal open={loading} />
            <Stack spacing={3}>
                <Stack direction="row" spacing={3}>
                    <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
                        <Typography variant="h4">My active routines</Typography>
                    </Stack>
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
                <Card sx={{ p: 2 }}>
                    <Stack direction="row" spacing={3}>
                        <OutlinedInput
                            defaultValue=""
                            fullWidth
                            placeholder="Search Routines"
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
                <RoutinesStatTable
                    count={filteredRoutines.length}
                    page={page}
                    rows={filteredRoutines}
                    rowsPerPage={rowsPerPage}
                    selectedRow={selectedRow}
                    toggle={toggleSelected}
                />
            </Stack>
        </>
    );


}

export default RoutinesLanding
