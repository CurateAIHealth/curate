
import type { NextApiRequest, NextApiResponse } from "next";
import type { Collection, Document } from "mongodb";
import clientPromise from "@/Lib/db";

const CONFIG_ID = "hcp-quality-question-config";

interface QuestionConfig extends Document {
  _id: string;
  sections: unknown[];
  trashQuestions: unknown[];
  createdAt: Date;
  updatedAt: Date;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: QuestionConfig | null;
  totalSections?: number;
  totalQuestions?: number;
}

async function getCollection(): Promise<Collection<QuestionConfig>> {
  const cluster = await clientPromise;
  const db = cluster.db("CurateInformation");

  return db.collection<QuestionConfig>("HCPQualityQuestions");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
): Promise<void> {
  try {
    const collection = await getCollection();

    // GET: Fetch questions
    if (req.method === "GET") {
      const config = await collection.findOne({
        _id: CONFIG_ID,
      });

      return res.status(200).json({
        success: true,
        data: config as unknown as QuestionConfig | null,
      });
    }

    // POST: Initialize only once
    if (req.method === "POST") {
      const { sections, trashQuestions = [] } = req.body ?? {};

      if (
        !Array.isArray(sections) ||
        sections.length === 0 ||
        !Array.isArray(trashQuestions)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid question data.",
        });
      }

      const totalQuestions = sections.reduce(
        (total: number, section: any) => {
          return (
            total +
            (Array.isArray(section?.questions)
              ? section.questions.length
              : 0)
          );
        },
        0
      );

      // Atomic insert: existing configuration is never overwritten.
      const result = await collection.updateOne(
        { _id: CONFIG_ID },
        {
          $setOnInsert: {
            sections,
            trashQuestions,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );

      if (result.upsertedCount === 0) {
        return res.status(409).json({
          success: false,
          message: "Questions are already initialized in MongoDB.",
        });
      }

      return res.status(201).json({
        success: true,
        message: "Questions initialized successfully.",
        totalSections: sections.length,
        totalQuestions,
      });
    }

    // PUT: Update existing question configuration
    if (req.method === "PUT") {
      const { sections, trashQuestions = [] } = req.body ?? {};

      if (
        !Array.isArray(sections) ||
        !Array.isArray(trashQuestions)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid question data.",
        });
      }

      const existingConfig = await collection.findOne({
        _id: CONFIG_ID,
      });

      if (!existingConfig) {
        return res.status(404).json({
          success: false,
          message: "Questions are not initialized yet. Initialize first.",
        });
      }

      await collection.updateOne(
        { _id: CONFIG_ID },
        {
          $set: {
            sections,
            trashQuestions,
            updatedAt: new Date(),
          },
        }
      );

      return res.status(200).json({
        success: true,
        message: "Questions saved successfully.",
      });
    }

    res.setHeader("Allow", ["GET", "POST", "PUT"]);

    return res.status(405).json({
      success: false,
      message: `Method ${req.method} Not Allowed.`,
    });
  } catch (error) {
    console.error("HCPQualityQuestions API Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
}
