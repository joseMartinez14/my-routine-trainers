'use client';
import { Box, Card, Divider, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react'
import { ClientRoutineStat } from '@/app/api/routines/type';

function formatDateBeautify(date_string: string): string {
    const date = new Date(date_string);
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    };

    return date.toLocaleDateString(undefined, options);
}


interface RoutinesTableProps {
    title: string;
    count: number;
    page: number;
    rows: ClientRoutineStat[];
    rowsPerPage: number;
}

const RoutinesTable = (props: RoutinesTableProps) => {

    const { title, count, page, rows, rowsPerPage } = props;

    const [actualPage, setPage] = useState<number>(page);
    const [actualRowsPerPage, setRowsPerPage] = useState<number>(rowsPerPage);
    const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page when rows per page changes
    };

    const page_rows = useMemo<ClientRoutineStat[]>(() => {
        return rows.slice(actualPage * actualRowsPerPage, actualPage * actualRowsPerPage + actualRowsPerPage);

    }, [actualPage, actualRowsPerPage, rows])


    return (
        <Card>
            <Typography
                variant="subtitle2"
                gutterBottom
                sx={{
                    fontSize: '24px',
                    margin: 0,
                    padding: 0,
                    fontWeight: 700,
                    py: 2,
                    pl: 2
                }}>
                {title}
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: '800px' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Created at</TableCell>
                            <TableCell>Routine name</TableCell>
                            <TableCell>Days amount</TableCell>
                            <TableCell>Avg day exercises</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow hover key={row.routine_id} >
                                <TableCell> {formatDateBeautify(row.routine_created_time)} </TableCell>
                                <TableCell> {row.routine_name} </TableCell>
                                <TableCell>{row.day_amount}</TableCell>
                                <TableCell>{row.avg_day_exercises}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
            <Divider />
            <TablePagination
                component="div"
                count={count}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                page={actualPage}
                rowsPerPage={actualRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </Card>
    );
}

export default RoutinesTable