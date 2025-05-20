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
import ClientsTable, { Client } from './Components/clients-table';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingModal from '@/app/components/LoadingModal';


interface ClientsPageProps {
    clientsRows: Client[]
}



const ClientsPage = (props: ClientsPageProps) => {

    const { clientsRows } = props;

    const router = useRouter();
    const [filteredClients, setfilteredClients] = useState<Client[]>(clientsRows)
    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const [selectedRows, setSelectedRows] = useState<Client[]>([]);


    const addSelectedRow = (row: Client) => {
        setSelectedRows((prev) => [...prev, row]);
    };

    const removeSelectedRow = (id: string) => {
        setSelectedRows((prev) => prev.filter((row) => row.id !== id));
    };

    const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    }

    const onSearchClick = () => {
        const filteredClients = clientsRows.filter(client =>
            client.name.toLowerCase().includes(search.toLowerCase()) ||
            client.phone.includes(search) // Optionally filter by phone number as well
        );
        setfilteredClients(filteredClients)
    }


    const page = 0;
    const rowsPerPage = 5;
    return (
        <>
            <LoadingModal open={loading} />
            <Stack spacing={3}>
                <Stack direction="row" spacing={3}>
                    <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
                        <Typography variant="h4">Clientes</Typography>
                    </Stack>
                    <div>
                        <Button
                            onClick={() => { router.push(`${window.location.pathname}/add`) }}
                            startIcon={<DeleteOutlinedIcon />}
                            variant="contained"
                            sx={{ mx: 2 }}
                            disabled={!(selectedRows.length > 0)}
                        >
                            Eliminar
                        </Button>
                        <Button
                            onClick={() => { router.push(`${window.location.pathname}/edit?id=${selectedRows[0].id}`) }}
                            startIcon={<EditNoteOutlinedIcon />}
                            variant="contained"
                            disabled={!(selectedRows.length == 1)}
                            sx={{ mx: 2 }}
                        >
                            Editar
                        </Button>

                        <Button
                            onClick={() => { router.push(`${window.location.pathname}/add`) }}
                            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
                            variant="contained"
                            sx={{ mx: 2 }}
                        >
                            Agregar
                        </Button>
                    </div>
                </Stack>
                <Card sx={{ p: 2 }}>
                    <Stack direction="row" spacing={3}>
                        <OutlinedInput
                            defaultValue=""
                            fullWidth
                            placeholder="Buscar clientes"
                            onChange={onSearchChange}
                            startAdornment={
                                <InputAdornment position="start">
                                    <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
                                </InputAdornment>
                            }
                            sx={{ maxWidth: '500px' }}
                        />
                        <Button onClick={onSearchClick} startIcon={<MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
                            Buscar
                        </Button>
                    </Stack>

                </Card>
                <ClientsTable
                    count={filteredClients.length}
                    page={page}
                    rows={filteredClients}
                    rowsPerPage={rowsPerPage}
                    selectedRows={selectedRows}
                    addSelectedRow={addSelectedRow}
                    removeSelectedRow={removeSelectedRow}
                />
            </Stack>
        </>
    );


}

export default ClientsPage
