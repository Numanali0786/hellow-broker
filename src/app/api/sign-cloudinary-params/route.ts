// app/api/sign-cloudinary-params/route.ts
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(request: Request) {
  const body = await request.json();
  const { folder, uploadPreset } = body;

  const timestamp = Math.round(Date.now() / 1000);

  const paramsToSign: Record<string, string | number> = {
    timestamp,
  };

  if (folder) paramsToSign.folder = folder;
  if (uploadPreset) paramsToSign.upload_preset = uploadPreset;

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );

  return NextResponse.json({
    signature,
    timestamp,
    upload_preset: uploadPreset,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
  });
}
