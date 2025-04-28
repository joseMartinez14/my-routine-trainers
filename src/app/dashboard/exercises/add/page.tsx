'use client'
import { Autocomplete, Avatar, Box, Button, Card, Grid2, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useForm } from 'react-hook-form';
import TextInput from '@/app/components/TextInput';
import { maxWidth } from '@mui/system';
import axios, { AxiosError } from 'axios';
import Swal from 'sweetalert2';
import LoadingModal from '@/app/components/LoadingModal';
import SelectBodyPartsItem from '../Components/selectBpItem';
import { AddExerciseForm } from '../type';
import { getNewerFirebaseTokenClient } from '@/utils/authClient';

interface bodyParts {
    id: number,
    name: string
}

const AddExercise = () => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    const [bodyPartsList, setBodyPartsList] = useState<bodyParts[]>([]);
    const [bodyPartsListSelected, setBodyPartsListSelected] = useState<bodyParts[]>([]);
    const [selectedOption, setSelectedOption] = useState<{ id: number; name: string } | null>(null);

    //====================================
    //Image section
    //====================================
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file)); // Generate preview URL
        }
    };

    //====================================
    //Video section
    //====================================

    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);

    const handleFileVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        console.log(file)
        if (file) {
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file)); // Generate preview URL
        }
    };

    //==================================
    //Body parts section
    //==================================


    const onBPChange = (newValue: bodyParts | null) => {
        setSelectedOption(newValue)
        if (newValue) {
            setBodyPartsListSelected((prev) =>
                prev.some((part) => part.id === newValue.id) ? prev : [...prev, newValue]
            );
        }
    }

    const onBPDelete = (id: string) => {
        setBodyPartsListSelected((prev) => prev.filter((part) => part.id !== Number(id)));

    }


    const queryExercises = async () => {
        setLoading(true);

        await axios.get("/api/bodyparts")
            .then((res) => {
                setBodyPartsList(res.data)

            })
            .catch((error => {
                console.error(error)
                Swal.fire({
                    title: "Error",
                    text: `Message: ${error}`,
                    icon: "error"
                });
            }))
        setLoading(false);
    }

    useEffect(() => {
        queryExercises()
    }, []);

    //==================================

    const onSubmit = async (data: AddExerciseForm) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("name", data.name)

        if (imageFile) {
            formData.append("icon", imageFile)

        }
        if (videoFile)
            formData.append("video", videoFile)

        if (bodyPartsListSelected) {
            const idsString = bodyPartsListSelected.map(item => item.id).join(",");
            formData.append("bodPartsIds", idsString)
        }

        const new_token = await getNewerFirebaseTokenClient()
        await axios.post("/api/exercises", formData, {
            headers: {
                Authorization: `Bearer ${new_token}`,
                "Content-Type": "multipart/form-data"
            },
        })
            .then((res) => {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Exercise saved",
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .catch((error: AxiosError) => {
                console.error(error)
                Swal.fire({
                    title: "Error",
                    text: `Message: ${error.response?.data}`,
                    icon: "error"
                });
            })
        setLoading(false);
    }



    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<AddExerciseForm>();

    return (
        <>
            <LoadingModal open={loading} />
            <Box
                component="form"
                autoComplete="on"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Stack spacing={3}>
                    <Stack direction="row" spacing={3}>
                        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
                            <Typography variant="h4">Add exercise</Typography>
                        </Stack>
                        <div>
                            <Button onClick={() => { router.push("/dashboard/exercises") }} startIcon={<ArrowBackIcon />} variant="contained">
                                Back
                            </Button>
                        </div>
                    </Stack>
                    <Card sx={{ p: 2 }}>
                        <TextInput control={control} title='Name' value='name' isRequired={true} styles={{ width: '100%', maxWidth: '600px', pt: '10px' }} error={errors?.name ? "This field is required" : undefined} />

                        <Box display="flex" flexDirection="column" gap={2} sx={{ width: '100%', maxWidth: '600px', pt: '10px', py: 4 }}>
                            <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                    fontSize: '18px',
                                    margin: 0,
                                    padding: 0,
                                    fontWeight: 500,
                                }}>
                                {"Body Parts activated"}
                            </Typography>
                            <Autocomplete
                                options={bodyPartsList}
                                getOptionLabel={(option) => option.name} // Display name in dropdown
                                value={selectedOption}
                                onChange={(_, newValue) => onBPChange(newValue)}
                                renderInput={(params) => <TextField {...params} label="Select an option" variant="outlined" />}
                                filterOptions={(options, { inputValue }) =>
                                    options.filter((option) => option.name.toLowerCase().includes(inputValue.toLowerCase()))
                                } // Filters based on input
                            />
                        </Box>

                        <Box display="flex" flexDirection="column" gap={2} sx={{ width: '100%', maxWidth: '600px', pt: '10px', pb: 4 }}>
                            <Grid2 container spacing={5} >
                                {bodyPartsListSelected.map((item) => (
                                    <Grid2 key={item.id} >
                                        <SelectBodyPartsItem
                                            id={String(item.id)}
                                            value={item.name}
                                            width={100}
                                            height={40}
                                            fontSize={18}
                                            onCancel={onBPDelete}
                                        />
                                    </Grid2>
                                ))}
                            </Grid2>
                        </Box>

                        <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{
                                fontSize: '18px',
                                margin: 0,
                                fontWeight: 500,
                                pt: 4
                            }}>
                            {"Exercise Icon"}
                        </Typography>
                        <Box display="flex" flexDirection="row" alignItems="center" gap={2} sx={{ width: '100%', maxWidth: '600px', pt: '10px', pb: 5 }}>

                            {/* Hidden File Input */}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                id="image-upload"
                                style={{ display: "none" }}
                            />

                            {/* Upload Button */}
                            <label htmlFor="image-upload">
                                <Button variant="contained" component="span">
                                    Upload Image
                                </Button>
                            </label>
                            {/* Image Preview */}
                            <Avatar
                                src={imagePreview || ""}
                                alt="Preview"
                                sx={{ width: 220, height: 220 }}
                            />


                        </Box>

                        <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{
                                fontSize: '18px',
                                margin: 0,
                                fontWeight: 500,
                                pt: 4
                            }}>
                            {"Exercise video example"}
                        </Typography>
                        <Box display="flex" flexDirection="row" alignItems="center" gap={2} sx={{ width: '100%', maxWidth: '600px', pt: '10px', pb: 4 }}>

                            {/* Hidden File Input */}
                            <input
                                type="file"
                                accept="video/*"
                                onChange={handleFileVideoChange}
                                id="video-upload"
                                style={{ display: "none" }}
                            />

                            {/* Upload Button */}
                            <label htmlFor="video-upload">
                                <Button variant="contained" component="span">
                                    Upload Video
                                </Button>
                            </label>
                            {/* Video Preview */}
                            {videoPreview && (
                                <video controls width="300">
                                    <source src={videoPreview} type={videoFile?.type} />
                                    Your browser does not support the video tag.
                                </video>
                            )}


                        </Box>

                    </Card>
                    <Button type="submit" variant="contained" sx={{ maxWidth: '200px' }}>
                        Submit
                    </Button>
                </Stack>
            </Box>
        </>

    )
}

export default AddExercise