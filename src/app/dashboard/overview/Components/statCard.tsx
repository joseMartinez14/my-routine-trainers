import { Box, Card, Stack, Typography } from '@mui/material'
import React from 'react'

interface StatCardProp {
    title: string;
    value: string;
}

const StatCard = (props: StatCardProp) => {

    const { title, value } = props;

    return (
        <Card sx={{ p: 1, height: '90px', minWidth: '180px' }}>
            <Stack direction="column" spacing={1}>
                <Box
                    sx={{
                        width: '100%', // Make the box fill all the width
                        display: 'flex',
                        justifyContent: 'center', // Center items horizontally
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="h6"
                        sx={{
                            fontSize: '14px',
                            fontWeight: 200,
                        }}>
                        {title}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        width: '100%', // Make the box fill all the width
                        height: '50px', // Make the box fill all the width
                        display: 'flex',
                        justifyContent: 'center', // Center items horizontally
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="h5">{value}</Typography>
                </Box>
            </Stack>
        </Card>
    )
}

export default StatCard