import { Box, Paper, Typography } from '@mui/material'
import React from 'react'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface AiButtonProps {
    onAIsubmit: () => void;
    text: string;
    width: string;
}

const AiButton = (props: AiButtonProps) => {

    const { onAIsubmit, text, width } = props;
    return (
        <Paper elevation={2} sx={{ py: 0.4, width: width, backgroundColor: '#6d6d6d' }}>
            <div onClick={() => { onAIsubmit() }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'columm',
                    justifyContent: 'space-around',
                    p: 1
                }}>
                    <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{
                            fontSize: '12px',
                            margin: 0,
                            fontWeight: 400,
                            textAlign: 'center'

                        }}>
                        {text}
                    </Typography>
                    <AutoAwesomeIcon />
                </Box>
            </div>
        </Paper>
    )
}

export default AiButton