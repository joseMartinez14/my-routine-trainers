import { getOpenIAExerciseImage } from '@/utils/ai';
import { uploadFileToS3 } from '@/utils/aws-s3';

export async function POST(req: Request) {
  try {
    const trainer_id = req.headers.get('Trainer-ID') || '';
    const data = await req.json();
    if (!process.env.OPENAI_EXERCISE_PROMPT || !data.exercise)
      return Response.json({ error: 'Prompt error' }, { status: 500 });

    let prompt = process.env.OPENAI_EXERCISE_PROMPT.replace('{exercise}', data.exercise);

    const ai_generated_obj = await getOpenIAExerciseImage(prompt, data.description);
    let iconLink: string | null = null;

    console.log('Going to store image on AWS');
    if (ai_generated_obj.file) iconLink = await uploadFileToS3(ai_generated_obj.file, trainer_id, 'image/png');

    if (!iconLink) {
      return Response.json({ error: 'Image not generated' }, { status: 500 });
    }

    return Response.json({ imageURL: iconLink });
  } catch (error: any) {
    console.error(error);
    return Response.json({ error: error }, { status: 500 });
  }
}
