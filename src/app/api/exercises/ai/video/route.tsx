import { getVideoFromExerciseImage } from '@/utils/ai';
import { uploadFileToS3 } from '@/utils/aws-s3';

export async function POST(req: Request) {
    try {
        const trainer_id = req.headers.get('Trainer-ID') || '';
        const data = await req.json();
        if (!process.env.VIDEO_PROMPT || !data.exercise)
            return Response.json({ error: 'Prompt error' }, { status: 500 });

        let prompt = process.env.VIDEO_PROMPT.replace('{exercise}', data.exercise);

        const ai_generated_video = await getVideoFromExerciseImage(prompt, data.imageURL, data.exercise, data.desciption);
        console.log('Going to store video on AWS');
        let videoLink: string | null = null;
        if (ai_generated_video) videoLink = await uploadFileToS3(ai_generated_video, trainer_id, 'video/mp4');

        return Response.json({ videoURL: videoLink });

    } catch (error: any) {
        console.error(error);
        return Response.json({ error: error }, { status: 500 });
    }
}
