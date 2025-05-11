import { getOpenIAExerciseImage, getVideoFromExerciseImage } from '@/utils/ai';
import { uploadFileToS3 } from '@/utils/aws-s3';

export async function POST(req: Request) {
  try {
    const trainer_id = req.headers.get('Trainer-ID') || '';
    const data = await req.json();

    const ai_generated_obj = await getOpenIAExerciseImage(data.exercise);
    let iconLink: string | null = null;

    // console.log('Going to store image on AWS');
    // if (ai_generated_obj.file) iconLink = await uploadFileToS3(ai_generated_obj.file, trainer_id, 'image/png');

    // if (!iconLink) {
    //   return Response.json({ error: 'Image not generated' }, { status: 500 });
    // }

    // // console.log('AWS stored: ', iconLink);

    // const ai_generated_video = await getVideoFromExerciseImage(iconLink, data.exercise, ai_generated_obj.explanaton);
    // console.log('Going to store video on AWS');
    // let videoLink: string | null = null;
    // if (ai_generated_video) videoLink = await uploadFileToS3(ai_generated_video, trainer_id, 'video/mp4');

    // return Response.json({ imageURL: iconLink, videoURL: videoLink });
  } catch (error: any) {
    console.error(error);
    return Response.json({ error: error }, { status: 500 });
  }
}
