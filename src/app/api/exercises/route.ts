import { uploadFileToS3 } from '@/utils/aws-s3';

import { create_new_exercise, get_trainer_exercises } from './service';

export async function GET(req: Request) {
  try {
    const trainer_id = req.headers.get('Trainer-ID') || '';
    const exercises = await get_trainer_exercises(trainer_id);
    return Response.json(exercises);
  } catch (error: any) {
    return Response.json({ error: error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const trainer_id = req.headers.get('Trainer-ID') || '';
    const data = await req.formData();
    const name = data.get('name') as string;
    const icon = data.get('icon') as File;
    const video = data.get('video') as File;
    const bodypartsIDsString = (data.get('bodPartsIds') as String) || '';
    const bodypartsIDs = bodypartsIDsString.split(',').map(Number);

    // return Response.json({ error: 'Puta vida' }, { status: 500 });

    let iconLink: string | null = null;
    let videoLink: string | null = null;
    try {
      if (icon) iconLink = await uploadFileToS3(icon, trainer_id);
      if (video) videoLink = await uploadFileToS3(video, trainer_id);
    } catch (error: any) {
      console.error('AWS error: ', error);
      return Response.json({ error: `Error saving video or image on AWS` }, { status: 500 });
    }

    return await create_new_exercise(trainer_id, name, iconLink, videoLink, bodypartsIDs);
  } catch (error: any) {
    return Response.json({ error: error }, { status: 500 });
  }
}
