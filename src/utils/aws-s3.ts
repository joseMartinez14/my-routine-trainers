import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid'; // Import the UUID module

export const uploadFileToS3 = async (
  file: File,
  user_id: string,
  content_type: string = 'application/octet-stream'
) => {
  const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_ID!,
      secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY!,
    },
  });

  // Convert File to Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const key = uuidv4(); // Generate a new UUID
  const extension = getFileExtension(file);
  const keyName = `${user_id}/${key}.${extension}`;
  const url = `https://${process.env.BUCKET_NAME}.s3.us-east-2.amazonaws.com/${keyName}`;
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: keyName,
    Body: buffer,
    ContentType: content_type, // ✅ This is what you need
  });

  const result = await s3Client.send(command);
  // console.log('S3 response ', result);
  return url;
};

function getFileExtension(file: File): string {
  const fileNameParts = file.name.split('.');
  if (fileNameParts.length > 1) {
    return fileNameParts[fileNameParts.length - 1];
  } else {
    return ''; // No extension found
  }
}
