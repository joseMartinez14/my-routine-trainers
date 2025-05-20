'use client'
import LoadingModal from '@/app/components/LoadingModal';
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
import { OverviewStats } from '@/app/api/overview/type';


interface OverviewProps {
    stats: OverviewStats | undefined | null;
}

const OverviewPage = (props: OverviewProps) => {


    const { stats } = props;

    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [countRoutine, setCountRoutines] = useState<number>(stats?.count_active_routines || 0);
    const [countClients, setCountClients] = useState<number>(stats?.count_clients || 0);
    const [countExercises, setCountExercises] = useState<number>(stats?.count_exercises || 0);
    const [routinesRows, setRoutinesRows] = useState<RoutineListStat[]>(stats?.top_routines || []);
    const [selectedRow, setSelectedRow] = useState<RoutineListStat | undefined>(undefined);

    const toggleSelected = (row: RoutineListStat) => {
        setSelectedRow(row)
    }

    const page = 0;
    const rowsPerPage = 5;

    return (
        <>
            <LoadingModal open={loading} />
            <Stack spacing={3}>
                <Stack direction="row" spacing={3}>
                    <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
                        <Typography variant="h4">Resumen</Typography>
                    </Stack>
                </Stack>
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-around'
                }}>
                    <StatCard title='Rutinas Activas' value={String(countRoutine)} />
                    <StatCard title='# Clientes' value={String(countClients)} />
                    <StatCard title='# Ejercicios' value={String(countExercises)} />
                </Box>

                <Typography variant="h5" sx={{ pt: 4 }}>
                    {'Rutinas activas más viejas'}
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
                            Editar
                        </Button>
                        <Button
                            onClick={() => { router.push(`/dashboard/clients/routine/add?client_id=${selectedRow?.client_id}`) }}
                            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
                            variant="contained"
                            disabled={!selectedRow}
                            sx={{ mx: 2 }}
                        >
                            Agregar nueva
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

export default OverviewPage