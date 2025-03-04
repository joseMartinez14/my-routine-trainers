'use client'
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';
import { Card, InputAdornment, OutlinedInput } from '@mui/material';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import ClientsTable from './Components/clients-table';
import { useRouter } from 'next/navigation';


const Clients = () => {

    const router = useRouter();

    const onAddClick = () => {
        console.log("Click added")
        router.push(`${window.location.pathname}/add`)
    }

    return (
        <Stack spacing={3}>
            <Stack direction="row" spacing={3}>
                <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
                    <Typography variant="h4">Customers</Typography>
                </Stack>
                <div>
                    <Button onClick={onAddClick} startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
                        Add
                    </Button>
                </div>
            </Stack>
            <Card sx={{ p: 2 }}>
                <OutlinedInput
                    defaultValue=""
                    fullWidth
                    placeholder="Search Clients"
                    startAdornment={
                        <InputAdornment position="start">
                            <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
                        </InputAdornment>
                    }
                    sx={{ maxWidth: '500px' }}
                />
            </Card>
            <ClientsTable
            />
        </Stack>
    );
}

export default Clients