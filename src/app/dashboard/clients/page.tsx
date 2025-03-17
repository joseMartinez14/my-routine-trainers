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
import axios from 'axios';
import Swal from 'sweetalert2';
import LoadingModal from '@/app/components/LoadingModal';
import { getNewerFirebaseToken } from '@/utils/auth';




const Clients = () => {

    const router = useRouter();
    const [clientsRows, setClientsRows] = useState<Client[]>([])
    const [filteredClients, setfilteredClients] = useState<Client[]>([])
    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const [selectedRows, setSelectedRows] = useState<Client[]>([]);


    const addSelectedRow = (row: Client) => {
        setSelectedRows((prev) => [...prev, row]);
    };

    const removeSelectedRow = (id: string) => {
        setSelectedRows((prev) => prev.filter((row) => row.id !== id));
    };

    const queryClients = async () => {
        setLoading(true);

        const token = await getNewerFirebaseToken();
        await axios.get("/api/clients", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                setClientsRows(res.data)
                setfilteredClients(res.data)

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
        console.log("Pichhaaa")
        const filteredClients = clientsRows.filter(client =>
            client.name.toLowerCase().includes(search.toLowerCase()) ||
            client.phone.includes(search) // Optionally filter by phone number as well
        );
        setfilteredClients(filteredClients)
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
                        <Typography variant="h4">Clients</Typography>
                    </Stack>
                    <div>
                        <Button
                            onClick={() => { router.push(`${window.location.pathname}/add`) }}
                            startIcon={<DeleteOutlinedIcon />}
                            variant="contained"
                            sx={{ mx: 2 }}
                            disabled={!(selectedRows.length > 0)}
                        >
                            Remove
                        </Button>
                        <Button
                            onClick={() => { router.push(`${window.location.pathname}/edit?id=${selectedRows[0].id}`) }}
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
                            placeholder="Search Clients"
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

export default Clients
