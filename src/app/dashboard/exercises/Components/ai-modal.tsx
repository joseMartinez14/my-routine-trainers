import { Box, Button, Modal, TextField, Typography } from '@mui/material'
import { borderRadius } from '@mui/system';
import React, { useState } from 'react'

interface AiImageModelProps {
    open: boolean;
    handleClose: () => void;
    handleSubmit: (details?: string) => void;
    description: string;
    setDescription: (desciption: string) => void;
    exercise: string;
    title: string;
    basePrompt: string;
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: '#676767',
    boxShadow: 24,
    borderRadius: '20px',
    p: 4,
};

const AiModal = (props: AiImageModelProps) => {
    const { open, handleClose, exercise, handleSubmit, title, basePrompt, description, setDescription } = props;
    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h5" component="h2">
                    {title}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {basePrompt}
                </Typography>

                <Typography id="modal-modal-title" variant="h6" component="h2" pt={4} sx={{ fontSize: '20px' }}>
                    {`Descripción del ejercicio (Opcional):`}
                </Typography>
                <TextField
                    multiline={true}
                    rows={4}
                    sx={{
                        width: '100%',
                        pt: 1
                    }}
                    inputProps={{
                        style: {
                            height: '16px',
                        },
                    }}
                    onChange={(event) => { setDescription(event.target.value) }}
                    value={description}
                    id={"AiImageModel ID"}
                    placeholder={"Descripción extra del ejercicio para ayudar al IA"}
                    variant="outlined"
                />
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button onClick={() => { handleSubmit(description); handleClose() }} variant="contained" sx={{ maxWidth: '200px' }}>
                        Generar
                    </Button>
                    <Button onClick={() => handleClose()} variant="contained" color='error' sx={{ maxWidth: '200px', ml: 2 }}>
                        Cancelar
                    </Button>
                </Box>
            </Box>

        </Modal>
    )
}

export default AiModal