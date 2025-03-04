'use client'
import * as React from 'react';
import { Box, Button } from '@mui/material';
import InsertImages from './customers/insertImages';
import { useState } from 'react';
import axios from 'axios';

interface ImageItem {
  id: number;
  url: string;
  file?: File;
}

export default function Page(): React.JSX.Element {

  const [imageList, setImageList] = useState<ImageItem[]>([]);

  const OnImageDelete = (imageID: number) => {
    const updatedImageList = imageList.filter((item) => item.id !== imageID);
    setImageList(updatedImageList);
  }

  const onSubmitTest = () => {

    console.log("On submit test --")
    const formData = new FormData();
    formData.append("param1", "Hola soy parametro 1")
    if (imageList.length) {
      if (imageList[0].file) formData.append("some_image", imageList[0].file)
    }
    axios.post('/api/testing', formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        console.log(" onSubmitTest si paso y funciono");
        console.log(res);
      })
      .catch((err) => {
        console.log("no funciono y fallo");
        console.log(err);
      });
  }

  return (
    <div>

      <Box
        sx={{
          width: '80%', // Make the box fill all the width
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          minHeight: '250px',
          pt: 2
        }}
      >
        <InsertImages imageList={imageList} setImageList={setImageList} onImageDelete={OnImageDelete} />
        <Button variant='contained' onClick={onSubmitTest}> Submit</Button>
      </Box>

    </div>
  );
}
