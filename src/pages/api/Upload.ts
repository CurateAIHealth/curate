

import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { IncomingForm, File } from "formidable";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function name(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { fields, files } = await new Promise<{
      fields: formidable.Fields;
      files: formidable.Files;
    }>((resolve, reject) => {
      const form = new IncomingForm({ keepExtensions: true });
      form.parse(req, (err:any, fields:any, files:any) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const fileKey = Object.keys(files)[0];
    const fileOrFiles:any = files[fileKey];

    let file: File;

    if (Array.isArray(fileOrFiles)) {
      file = fileOrFiles[0];
    } else {
      file = fileOrFiles;
    }

    if (!file?.filepath) {
      return res.status(400).json({ error: "No file uploaded or invalid file." });
    }

    const filePath = file.filepath;

    const uploadedResponse = await cloudinary.uploader.upload(filePath, {
      folder: "uploads",
    });

    fs.unlinkSync(filePath);

    return res.status(200).json({ url: uploadedResponse.secure_url });
  } catch (error: any) {
    
    return res.status(500).json({ error: error.message || "Something went wrong" });
  }
};

