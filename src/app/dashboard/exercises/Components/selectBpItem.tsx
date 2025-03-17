'use client'

import { Box, Card, Typography } from '@mui/material';
import React from 'react'

import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

interface selectBpItemProps {
    value: string;
    id: string;
    width: number;
    height: number;
    fontSize: number;
    onCancel?: (hourValue: string) => void;

}


const SelectBodyPartsItem = (props: selectBpItemProps) => {

    const { width, height, fontSize, value, id, onCancel } = props;

    const handleClick = () => {

    }


    return (
        <div onClick={handleClick}>
            <Card sx={{ minWidth: width, minHeight: height, backgroundColor: '#7678ff', borderRadius: 1.5, position: 'relative', overflow: 'visible', px: 1, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                {/* Red Circle with "X" */}
                {onCancel &&
                    <div onClick={() => { onCancel(id) }}>
                        <CancelOutlinedIcon sx={{
                            position: 'absolute',
                            top: -8,
                            right: -4,
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }} />
                    </div>
                }

                {/* Main Content */}
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Typography
                        sx={{
                            color: 'black',
                            fontSize,
                            textAlign: 'center',
                            fontWeight: 400,
                        }}
                    >
                        {value}
                    </Typography>
                </Box>
            </Card>
        </div>
    )

}


export default SelectBodyPartsItem
