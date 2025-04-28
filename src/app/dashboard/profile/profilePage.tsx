'use client'
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Avatar, Box, Card, CardActions, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import Swal from 'sweetalert2';
import LoadingModal from '@/app/components/LoadingModal';
import TextInput from '@/app/components/TextInput';
import { useForm } from 'react-hook-form';
import { TrainerProfileForm, TrainerType } from './type';
import { getNewerFirebaseTokenClient } from '@/utils/authClient';


interface ProfilePageProps {
    profile: TrainerType;
}

const ProfilePage = (props: ProfilePageProps) => {

    const { profile } = props;

    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const [email, setEmail] = useState<string>("");

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

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<TrainerProfileForm>();

    const setProfile = (data: TrainerType) => {
        if (data.photoURL) setImagePreview(data.photoURL)
        setValue("name", data.name)
        setValue("phone", data.phone)
        setValue("aboutMe", data.aboutMe)
        setEmail(data.email)

    }

    const onSubmit = async (data: TrainerProfileForm) => {
        let continue_query = true;

        await Swal.fire({
            title: "Do you want to save the changes?",
            showDenyButton: true,
            confirmButtonText: "Save",
            denyButtonText: `Don't save`
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isDenied) {
                Swal.fire("Changes are not saved", "", "info");
                continue_query = false
            }
        });

        if (!continue_query) return

        setLoading(true);
        const formData = new FormData();
        formData.append("name", data.name)
        formData.append("phone", data.phone)
        if (data.photoURL) formData.append("old_icon", data.photoURL)
        if (data.aboutMe) formData.append("aboutMe", data.aboutMe)

        if (imageFile) {
            formData.append("icon", imageFile)
        }

        const new_token = await getNewerFirebaseTokenClient()

        await axios.put(`/api/profile`, formData, {
            headers: {
                Authorization: `Bearer ${new_token}`,
                "Content-Type": "multipart/form-data"
            },
        })
            .then((res) => {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Profile saved",
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

    useEffect(() => {
        setProfile(profile)
    }, [])

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
                            <Typography variant="h4">My profile</Typography>
                        </Stack>

                    </Stack>

                    <Card sx={{ p: 2 }}>
                        <Stack direction="column" spacing={3}>
                            <Box sx={{ width: '100%', maxWidth: '600px' }}>
                                <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                    sx={{
                                        fontSize: '18px',
                                        margin: 0,
                                        padding: 0,
                                        fontWeight: 500,
                                    }}>
                                    {"Email:"}
                                </Typography>
                                <TextField
                                    sx={{
                                        width: '100%',
                                    }}
                                    disabled
                                    inputProps={{
                                        style: {
                                            height: '16px',
                                        },
                                    }}
                                    value={email}
                                    variant="outlined"
                                />
                            </Box>
                            <TextInput control={control} title='Name' value='name' isRequired={true} styles={{ width: '100%', maxWidth: '600px', pt: '10px' }} error={errors?.name ? "This field is required" : undefined} />
                            <TextInput control={control} title='Phone' value='phone' isRequired={true} styles={{ width: '100%', maxWidth: '600px', pt: '10px' }} error={errors?.phone ? "This field is required" : undefined} />
                            <TextInput control={control} title='About me' value='aboutMe' isRequired={false} multiline styles={{ width: '100%', pt: '10px' }} error={errors?.aboutMe ? "This field is required" : undefined} />

                        </Stack>

                        <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{
                                fontSize: '18px',
                                margin: 0,
                                fontWeight: 500,
                                pt: 4
                            }}>
                            {"Profile picture"}
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

                        <CardActions sx={{ justifyContent: 'flex-end' }}>
                            <Button type="submit" variant="contained">Save changes</Button>
                        </CardActions>

                    </Card>

                </Stack>
            </Box>
        </>
    );


}

export default ProfilePage
