import { uploadFileToS3 } from '@/utils/aws-s3';

import { get_trainer_profile, update_profile } from './service';

export async function GET(req: Request) {
  try {
    const trainer_id = req.headers.get('Trainer-ID') || '';
    const profile = await get_trainer_profile(trainer_id);
    return Response.json(profile);
  } catch (error: any) {
    console.error(error);
    console.error(error);
    return Response.json({ error: error }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const trainer_id = req.headers.get('Trainer-ID') || '';
    const data = await req.formData();
    const name = data.get('name') as string;
    const phone = data.get('phone') as string;
    const aboutMe = data.get('aboutMe') as string;
    const old_icon = data.get('old_icon') as string;
    const icon = data.get('icon') as File;

    let iconLink: string | null = old_icon;
    try {
      if (icon) iconLink = await uploadFileToS3(icon, trainer_id);
    } catch (error: any) {
      console.error('AWS error: ', error);
      return Response.json({ error: `Error saving video or image on AWS` }, { status: 500 });
    }

    const data_to_return = await update_profile(trainer_id, name, phone, aboutMe, iconLink);
    return Response.json(data_to_return);
  } catch (error: any) {
    console.error(error);
    return Response.json({ error: error }, { status: 500 });
  }
}
