import { Box, Button, List, ListItem } from '@mui/material';
import React, { useRef } from 'react';

interface ImageItem {
    id: number;
    url: string;
    file?: File;
}

interface InsertImagesProps {
    imageList: ImageItem[];
    setImageList: (value: React.SetStateAction<ImageItem[]>) => void
    onImageDelete: (id: number) => void
}

const InsertImages = (props: InsertImagesProps) => {
    const { imageList, setImageList, onImageDelete } = props;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    const url = reader.result;
                    setImageList(prevList => [
                        ...prevList,
                        { id: Date.now() * -1, url, file },
                    ]);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClickUpload = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div>
            <Box
                sx={{
                    width: '100%', // Make the box fill all the width
                    display: 'flex',
                    justifyContent: 'center', // Center items horizontally
                    alignItems: 'center',
                    flexDirection: 'column',
                    pb: 5
                }}
            >
                <input
                    ref={fileInputRef}
                    accept="image/*"
                    id="image-input"
                    type="file"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                />
                <Button variant="contained" onClick={handleClickUpload}>
                    Upload Image
                </Button>
                <Box height={"100%"} width={"100%"} sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    <List sx={{ display: 'flex', flexDirection: 'column' }}>
                        {imageList.map(item => (
                            <ListItem key={item.id}>
                                <Box width={'220px'} height={'250px'} display={'flex'} flexDirection={'column'}
                                    sx={{
                                        border: '1px solid #000',
                                        borderRadius: 5,
                                        backgroundColor: '#EDEFF2',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }} >
                                    <img src={item.url} alt="Uploaded" style={{ width: '200px', height: '200px', objectFit: 'contain' }} />
                                    <div onClick={() => { onImageDelete(item.id) }}>
                                        delete
                                    </div>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Box>

        </div >
    );
};

export default InsertImages;