import { uploadFileToS3 } from '@/utils/aws-s3';

import { get_one_exercise, update_exercise } from '../service';

export async function GET(request: Request, { params }: { params: { exerciseID: string } }) {
  try {
    const exerciseID = params.exerciseID;
    const trainer_id = request.headers.get('Trainer-ID') || '';
    const exercises = await get_one_exercise(trainer_id, exerciseID);
    return Response.json(exercises);
  } catch (error) {
    console.error('Error fetching exercise:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const trainer_id = req.headers.get('Trainer-ID') || '';
    const data = await req.formData();
    const name = data.get('name') as string;
    const id = (data.get('id') as string) || '-1';
    const old_icon = data.get('old_icon') as string;
    const old_video = data.get('old_video') as string;
    const icon = data.get('icon') as File;
    const video = data.get('video') as File;
    const bodypartsIDsString = (data.get('bodPartsIds') as String) || '';
    const bodypartsIDs = bodypartsIDsString.split(',').map(Number);

    let iconLink: string | null = old_icon;
    let videoLink: string | null = old_video;
    try {
      if (icon) iconLink = await uploadFileToS3(icon, trainer_id);
      if (video) videoLink = await uploadFileToS3(video, trainer_id);
    } catch (error: any) {
      console.error('AWS error: ', error);
      return Response.json({ error: `Error saving video or image on AWS` }, { status: 500 });
    }

    return await update_exercise(trainer_id, Number(id), name, iconLink, videoLink, bodypartsIDs);
  } catch (error: any) {
    return Response.json({ error: error }, { status: 500 });
  }
}
