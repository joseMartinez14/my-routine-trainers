'use client';
import { Avatar, Box, Card, Checkbox, Divider, Table, TableBody, TableCell, TableHead, TablePagination, TableRow } from '@mui/material';
import React, { useMemo, useState } from 'react'

export interface Exercise {
    id: string;
    name: string;
    iconLogoURL: string;
    videoURL: string;
}

interface ExercisesTableProps {
    count: number;
    page: number;
    rows: Exercise[];
    rowsPerPage: number;
    selectedRows: Exercise[]
    addSelectedRow: (row: Exercise) => void
    removeSelectedRow: (id: string) => void
}

const ExercisesTable = (props: ExercisesTableProps) => {

    const { count, page, rows, rowsPerPage, selectedRows, addSelectedRow, removeSelectedRow } = props;


    const isRowSelected = (id: string) => {
        return selectedRows.some((row) => row.id === id);
    };


    const [actualPage, setPage] = useState<number>(page);
    const [actualRowsPerPage, setRowsPerPage] = useState<number>(rowsPerPage);

    const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page when rows per page changes
    };

    const page_rows = useMemo<Exercise[]>(() => {
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
                            <TableCell>Icon</TableCell>
                            <TableCell>Video</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {page_rows.map((row) => {
                            // const isSelected = selected?.has(row.id);
                            // selected = { isSelected }
                            const isSelected = isRowSelected(row.id);

                            return (
                                // <div onClick={() => {/* aqui deberia poner este id como el seleccionado y de ahi habilitar el delete y edit */ }}>
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
                                    <TableCell>
                                        <Avatar
                                            src={row.iconLogoURL || ""}
                                            alt="Preview"
                                            sx={{ width: 150, height: 150 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <video controls width="200">
                                            <source src={row.videoURL} type={`video/${row.videoURL.split('.').pop()?.toLowerCase()}`} />
                                            Your browser does not support the video tag.
                                        </video>
                                    </TableCell>
                                </TableRow>
                                // </div>
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

export default ExercisesTable