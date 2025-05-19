import fs, { createReadStream } from 'fs';
import path, { resolve } from 'path';
import { Readable } from 'stream';

import axios from 'axios';
import { fileFromPath } from 'formdata-node/file-from-path';
import { toFile } from 'openai';

import openai from '@/lib/openai';
import runawayml from '@/lib/runwayml';

import { CustomError } from './error';

type AIimageReturn = {
  file: File | null;
};

async function fileFromUrl(url: string, filename?: string): Promise<File> {
  const res = await fetch(url);
  const contentType = res.headers.get('content-type') || 'application/octet-stream';
  const buffer = await res.arrayBuffer();
  return new File([Buffer.from(buffer)], filename || 'file.png', { type: contentType });
}

async function fetchImageAsStream(url: string): Promise<Readable> {
  const response = await axios.get(url, {
    responseType: 'stream', // important!
  });

  // OpenAI expects a proper PNG — ensure content-type
  if (response.headers['content-type'] !== 'image/png') {
    throw new Error('Image is not a valid PNG');
  }

  return response.data; // this is a Readable stream
}

export async function fetchFileFromUrl(imageUrl: string, fileName: string) {
  const response = await fetch(imageUrl);
  const blob = await response.blob();

  // Create a File object (if needed for form uploads, etc.)
  const file = new File([blob], fileName, { type: blob.type });

  return file;
}

export const getOpenIAExerciseImage = async (prompt: string, details?: string): Promise<AIimageReturn> => {
  try {
    let final_prompt = `${prompt}`;
    if (details) {
      const explanation = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Responde unicamente 'verdadero' o 'falso' si el siguiente texto se trata sobre ejercicios fisicos "${details}"`,
          },
        ],
      });
      const answer = explanation.choices[0].message.content;
      console.log('answer, ', answer);

      if (answer?.toLowerCase().includes('falso') && answer.length < 20) {
        throw new CustomError('Its off topic', 520);
      }
      final_prompt += `. Más detalles: ${details}`;
    }

    console.log('On getOpenIAExerciseImage');
    console.log('prompt, ', final_prompt);
    const result = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1, // Important: DALL·E 3 supports only 1 image at a time
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url', // Explicitly set
    });

    if (!result.data) {
      console.error('No image generated for: ', final_prompt);
      throw new CustomError(`No image generated`, 521);
    }

    const url = result.data[0].url;

    console.log('AI URL: ', url);

    if (!url) {
      console.error('No image generated for: ', prompt);
      throw new CustomError(`No image generated`, 521);
    }

    const image = await fetchFileFromUrl(url, 'generated-image.png');
    return { file: image };
  } catch (error: any) {
    console.error('fetchImageAsFile Function Error:', error);
    throw new CustomError('Unknown error', 522);
  }
};

// export const getOpenIAExerciseImage = async (exercise: string): Promise<AIimageReturn> => {
// const rawExplanationPrompt = process.env.OPENAI_EXPLANATION_PROMPT ?? '';
// const explanationPrompt = rawExplanationPrompt.replace('{exercise}', exercise);
// try {
// const explanation = await openai.chat.completions.create({
//   model: 'gpt-3.5-turbo',
//   messages: [{ role: 'user', content: explanationPrompt }],
// });

// const answer = explanation.choices[0].message.content;

// const rawPrompt = process.env.OPENAI_EXERCISE_PROMPT ?? '';
// let prompt = rawPrompt.replace('{exercise}', exercise);

// if (answer) prompt += ` Explicación del ejercicio: ${answer}`;

// Step 1: Get

// const fileduck = await fileFromPath('./base1.png', { type: 'image/jpeg' });

// const fuckme = await toFile(createReadStream(resolve(process.cwd(), 'public/assets/base1.png')), null, {
//   type: 'image/png',
// });
// console.log('fuckme, ', resolve(process.cwd(), 'public/assets/base1.png'));
// console.log('fuckme, ', fuckme);

//   const file_putaa = await fileFromUrl(
//     'https://gym-routine.s3.us-east-2.amazonaws.com/mS7BtbrUOVSCD4OzI9KtqkXQmb03/ae9e7430-83f6-4eff-9241-b97f847878b9.png',
//     'image.png'
//   );

//   console.log(file_putaa);

//   const result = await openai.images.edit({
//     image: file_putaa,
//     prompt: 'Has algo gracioso',
//     // prompt: 'Manten el mismo fondo. Quitale las mancuernas a la persona y que baje la mano',
//     n: 1,
//     size: '1024x1024',
//   });

//   if (!result.data) {
//     console.error('No image generated for: ', prompt);
//     throw new Error(`No image generated for: ${exercise}`);
//   }
//   ``;

//   const url = result.data[0].url;

//   console.log('AI URL: ', url);

//   if (!url) {
//     console.error('No image generated for: ', prompt);
//     throw new Error(`No image generated for: ${exercise}`);
//   }

//   console.log('Image generated by Dall-E');

//   const image = await fetchFileFromUrl(url, 'generated-image.png');
//   return { file: image, explanaton: '' };
//   // } catch (error: any) {
//   //   console.error('fetchImageAsFile Function Error:', error);
//   //   throw error;
//   // }
// };

export const getVideoFromExerciseImage = async (
  prompt: string,
  imageURL: string,
  exercise: string,
  explanation: string | undefined | null
) => {
  try {
    if (explanation) prompt += `. Detalles extra: ${explanation}`;

    console.log('getVideoFromExerciseImage');
    console.log('Prompt: ', prompt);
    const result = await runawayml.imageToVideo.create({
      model: 'gen4_turbo',
      promptImage: imageURL,
      ratio: '960:960',
      duration: 5,
      promptText: prompt,
    });

    if (!result.id) {
      console.error('No Video generated for: ', prompt);
      throw new CustomError(`No Video generated`, 523);
    }

    const taskId = result.id;

    let task;
    do {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      task = await runawayml.tasks.retrieve(taskId);
      console.log(`Task status: ${task.status}`);
    } while (!['SUCCEEDED', 'FAILED'].includes(task.status));

    if (task.status === 'SUCCEEDED' && task.output) {
      console.log('Video URL:', task.output[0] || task.output);
      const video_url = task.output[0];

      const video = await fetchFileFromUrl(video_url, 'generated-image.mp4');
      return video;
    } else {
      console.error('Task failed:', task);
    }

    throw new CustomError(`No Video generated`, 523);
  } catch (error: any) {
    console.error('getVideoFromExerciseImage Function Error:', error);
    throw new CustomError(`Unknown error`, 524);
  }
};
