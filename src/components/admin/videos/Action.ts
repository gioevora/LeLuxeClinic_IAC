"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ActionResponse, Destroy } from "@/components/globals/types";
import {
  create as createSchema,
  update as updateSchema
} from "./schema";
import { formatErrors } from "@/components/globals/Utils";
import * as Yup from "yup";
import { Column } from "@/components/globals/types";
import { destroy as destroySchema } from "@/components/globals/schema";
import { Videos, VideosRow } from "./Types";
import fs from "fs";
import path from "path";

type videosCreateInput = Prisma.VideosCreateInput & {
  id?: string;
};

const model = "Videos";

export const table_Format = async (columns: Column[], records: Videos[]) => {

  return records.map((record) => {
    const row: VideosRow = {
      id: String(record.id),
      title: record.title,
      videoPath: record.videoPath,
      actions: "",
    };

    columns.forEach((column) => {
      const key = column.key as keyof Videos;
      if (key === "videoPath") {
        row.videoPath = record.videoPath;
      } else {
        row[key as keyof VideosRow] = record[key] ? String(record[key]) : "";
      }
    });

    return row;
  });
};

export const getAll = async () => {
  let records;

  try {
    records = await prisma.videos.findMany();
  } catch (error) {
    console.error("Database Error:", error);
    return {
      code: 500,
      message: "Server Error",
      records: [],
    };
  }

  const formattedRecords = records.map((record) => ({
    ...record,
    id: record.id,
  }));

  return {
    code: 200,
    message: `Fetched ${model}`,
    records: formattedRecords,
  };
};

export const create = async (values: videosCreateInput): Promise<ActionResponse> => {
  const schema = createSchema;

  try {
    await schema.validate(values, { abortEarly: false });
  } catch (ufErrors) {
    throw new Error("Validation Error: " + JSON.stringify(formatErrors(ufErrors as Yup.ValidationError)));
  }

  try {
    await prisma.videos.create({
      data: {
        title: values.title,
        videoPath: values.videoPath,
      },
    });

    return { code: 200, message: `Added ${values.title} successfully` };
  } catch (error) {
    console.error("Error creating testimonial:", error);
    throw new Error("Server Error: Unable to save testimonial.");
  }
};


export const update = async (
  values: Prisma.VideosCreateInput & { id: number }
) => {
  const schema = updateSchema;

  try {
    await schema.validate(values, { abortEarly: false });
  } catch (validationErrors) {
    const errors = formatErrors(validationErrors as Yup.ValidationError);
    return { code: 429, message: "Validation Error", errors };
  }

  try {
    await prisma.videos.update({ 
      where: { id: values.id },
      data: {
        title: values.title,
        videoPath: values.videoPath,
      },
    });

    return { code: 200, message: `${model} updated successfully` };
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return { code: 500, message: "Server Error" };
  }
};

export const destroy = async (values: Destroy) => {
  const schema = destroySchema;

  try {
    await schema.validate(values, { abortEarly: false });
  } catch (ufErrors) {
    const errors = formatErrors(ufErrors as Yup.ValidationError);

    const response: ActionResponse = {
      code: 429,
      message: "Validation Error",
      errors: errors,
    };
    return response;
  }

  try {
    await prisma.videos.delete({
      where: { id: Number(values.id) },
    });
  } catch {
    const response: ActionResponse = { code: 500, message: "Server Error" };
    return response;
  };

  const response: ActionResponse = { code: 200, message: `Deleted ${model}` };
  return response;
};


export const uploadVideo = async (formData: FormData) => {
  try {
    const video = formData.get("videoPath") as File; 
    if (!video) throw new Error("No video file received");

    const allowedExtensions = ['.mp4', '.avi', '.mov', '.mkv'];
    const fileExtension = path.extname(video.name).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      throw new Error("Invalid video file type. Allowed types are .mp4, .avi, .mov, .mkv");
    }
    const maxSize = 10 * 1024 * 1024; 
    if (video.size > maxSize) {
      throw new Error(`Video file is too large. Maximum size is ${maxSize / 1024 / 1024} MB.`);
    }

    const buffer = Buffer.from(await video.arrayBuffer());

    const uploadDir = path.join(process.cwd(), "public/uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const timestamp = Date.now();
    const videoFileName = `${timestamp}${fileExtension}`;
    const videoFilePath = path.join(uploadDir, videoFileName);

    fs.writeFileSync(videoFilePath, buffer);

    const videoUrl = `uploads/${videoFileName}`;

    return { url: videoUrl };
  } catch (error: unknown) { 
    if (error instanceof Error) {
      console.error("Video upload failed:", error.message);  
      return { error: error.message };  
    } else {
      console.error("Video upload failed: Unknown error");
      return { error: "Video upload failed due to an unknown error" };
    }
  }
};

