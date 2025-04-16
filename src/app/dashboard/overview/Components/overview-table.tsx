'use client';
import { Box, Card, Radio, Divider, Stack, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react'
import { RoutineListStat } from '../../routines/type';

//Por alguna puta razon no lo pude importar
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


interface RoutinesStatTableProps {
    count: number;
    page: number;
    rows: RoutineListStat[];
    rowsPerPage: number;
    selectedRow: RoutineListStat | undefined;
    toggle: (row: RoutineListStat) => void
}

const RoutinesStatTable = (props: RoutinesStatTableProps) => {

    const { count, page, rows, rowsPerPage, selectedRow, toggle } = props;

    const [actualPage, setPage] = useState<number>(page);
    const [actualRowsPerPage, setRowsPerPage] = useState<number>(rowsPerPage);

    const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };


    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page when rows per page changes
    };

    const page_rows = useMemo<RoutineListStat[]>(() => {
        return rows.slice(actualPage * actualRowsPerPage, actualPage * actualRowsPerPage + actualRowsPerPage);

    }, [actualPage, actualRowsPerPage, rows])


    return (
        <Card>
            <Box sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: '800px' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Select</TableCell>
                            <TableCell>Created date</TableCell>
                            <TableCell>Client name</TableCell>
                            <TableCell>Routine name</TableCell>
                            <TableCell>Training weekly days</TableCell>
                            <TableCell>Avg day exercises</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {page_rows.map((row) => {
                            // const isSelected = selected?.has(row.id);
                            // selected = { isSelected }
                            return (
                                <TableRow hover key={row.routine_id} >
                                    <TableCell padding="checkbox">
                                        <Radio
                                            checked={(selectedRow && row.routine_id == selectedRow.routine_id) ? true : false}
                                            onChange={() => { toggle(row) }}
                                        />
                                    </TableCell>
                                    <TableCell> {formatDateBeautify(row.routine_created_time)} </TableCell>
                                    <TableCell> {row.client_name} </TableCell>
                                    <TableCell>{row.routine_name}</TableCell>
                                    <TableCell>
                                        {row.day_amount}
                                    </TableCell>
                                    <TableCell>{row.avg_day_exercises}</TableCell>
                                </TableRow>
                            );
                        })}
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

export default RoutinesStatTable