'use client';
import { Box, Card, Checkbox, Divider, Stack, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react'

function noop(): void {
    // do nothing
}

export interface Client {
    id: string;
    name: string;
    phone: string;
    anatomy?: string;
    injuries?: string;
    objective?: string;
    experience?: string;
    weeklyTrainingDays: number;
    trainingMinutes: number;
}

interface ClientsTableProps {
    count: number;
    page: number;
    rows: Client[];
    rowsPerPage: number;
    selectedRows: Client[]
    addSelectedRow: (row: Client) => void
    removeSelectedRow: (id: string) => void
}

const ClientsTable = (props: ClientsTableProps) => {

    const { count, page, rows, rowsPerPage, selectedRows, addSelectedRow, removeSelectedRow } = props;

    const [actualPage, setPage] = useState<number>(page);
    const [actualRowsPerPage, setRowsPerPage] = useState<number>(rowsPerPage);

    const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const isRowSelected = (id: string) => {
        return selectedRows.some((row) => row.id === id);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page when rows per page changes
    };

    const page_rows = useMemo<Client[]>(() => {
        return rows.slice(actualPage * actualRowsPerPage, actualPage * actualRowsPerPage + actualRowsPerPage);

    }, [actualPage, actualRowsPerPage, rows])


    return (
        <Card>
            <Box sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: '800px' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Select</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>anatomy</TableCell>
                            <TableCell>objective</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {page_rows.map((row) => {
                            // const isSelected = selected?.has(row.id);
                            // selected = { isSelected }
                            const isSelected = isRowSelected(row.id);

                            return (
                                <TableRow hover key={row.id} >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isSelected}
                                            onChange={(event) => {
                                                if (event.target.checked) {
                                                    addSelectedRow(row);
                                                } else {
                                                    removeSelectedRow(row.id);
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell> {row.name} </TableCell>
                                    <TableCell>{row.phone}</TableCell>
                                    <TableCell>
                                        {row.anatomy}
                                    </TableCell>
                                    <TableCell>{row.objective}</TableCell>
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

export default ClientsTable