import { NextResponse } from 'next/server';
import { uploadFileToS3 } from '@/utils/aws-s3';
import { IncomingForm } from 'formidable';

export async function POST(req: Request) {
  console.log('On API testing post');
  //   const { files, fields } = await parseFormData(req);

  const data = await req.formData();
  console.log(data);
  console.log(typeof data.get('param1'));
  console.log(typeof data.get('some_image'));

  // Access file
  const file = data.get('some_image') as File;

  if (file) {
    console.log('Uploaded file:', file.name, file.size, file.type);
    console.log('  -    ');
    console.log('  -    ');

    uploadFileToS3(file, 'fake_user');

    console.log('  -    ');
    console.log('  -    ');
  }

  return Response.json({ testing: 'Some shit' });
}

// // Helper function to parse form data
// async function parseFormData(req: Request): Promise<{
//   files: Record<string, any>;
//   fields: Record<string, string>;
// }> {
//   return new Promise((resolve, reject) => {
//     const form = new IncomingForm({
//       keepExtensions: true, // Keep file extensions
//       uploadDir: './public/uploads', // Set the upload directory
//     });

//     form.parse(req, (err, fields, files) => {
//       if (err) {
//         reject(err);
//         return;
//       }
//       resolve({ files, fields });
//     });
//   });
// }
