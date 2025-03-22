'use client';
import { Box, Card, Checkbox, Divider, IconButton, Stack, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react'
import { ExerciseRoutineMap } from '../../exercises/type';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

function noop(): void {
    // do nothing
}


interface RoutineExercisesTableProps {
    title: string;
    count: number;
    page: number;
    rows: ExerciseRoutineMap[];
    rowsPerPage: number;
    removeSelectedRow: (id: number) => void
}

const RoutineExercisesTable = (props: RoutineExercisesTableProps) => {

    const { title, count, page, rows, rowsPerPage, removeSelectedRow } = props;

    const [actualPage, setPage] = useState<number>(page);
    const [actualRowsPerPage, setRowsPerPage] = useState<number>(rowsPerPage);
    const [finalRows, setFinalRows] = useState<JSX.Element[]>([]);
    const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page when rows per page changes
    };

    const page_rows = useMemo<ExerciseRoutineMap[]>(() => {
        return rows.slice(actualPage * actualRowsPerPage, actualPage * actualRowsPerPage + actualRowsPerPage);

    }, [actualPage, actualRowsPerPage, rows])


    useEffect(() => {
        const processed_rows: JSX.Element[] = []

        let temp_day = -1

        page_rows.forEach((row) => {

            const bodyParts = row.exercise.ExerciseBodyPartsMap.map((bp) => (bp.bodyPart.name)).join(" - ")

            if (row.day > temp_day) {
                temp_day = row.day
                processed_rows.push(
                    <TableRow >
                        <TableCell colSpan={6} align="center" >{`Training day ${row.day}`}</TableCell>
                    </TableRow>
                )
            }
            processed_rows.push(
                <TableRow hover key={row.id} >
                    <TableCell> {row.exercise.name} </TableCell>
                    <TableCell>{bodyParts}</TableCell>
                    <TableCell>{row.reps}</TableCell>
                    <TableCell>{row.variation}</TableCell>
                    <TableCell>{row.weight}</TableCell>
                    <TableCell>
                        <IconButton onClick={() => removeSelectedRow(row.id)} color="error">
                            <DeleteOutlineIcon />
                        </IconButton>
                    </TableCell>
                </TableRow>
            )
        })

        setFinalRows(processed_rows)


    }, [page_rows]);


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
                            <TableCell>Exercise</TableCell>
                            <TableCell>Body Parts</TableCell>
                            <TableCell>Reps</TableCell>
                            <TableCell>Variation</TableCell>
                            <TableCell>Weight</TableCell>
                            <TableCell>Remove</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {finalRows}
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

export default RoutineExercisesTable