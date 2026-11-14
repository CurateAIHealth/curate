
import type { NextApiRequest, NextApiResponse } from "next";
import { randomUUID } from "crypto";
import clientPromise from "@/Lib/db";

const DB_NAME = "CurateInformation";
const COLLECTION_NAME = "Questions";

type FeedbackType =
  | "Deployment"
  | "Replacement"
  | "Termination"
  | "Random Check-in";

type AnswerType = "textarea" | "yesNo" | "text";

interface QuestionInput {
  id?: string;
  sectionId: string;
  sectionTitle: string;
  number?: number;
  question: string;
  answerType: AnswerType;
  subHeading?: string;
  feedbackType: FeedbackType;
  active?: boolean;
  order?: number;
}

const VALID_FEEDBACK_TYPES: FeedbackType[] = [
  "Deployment",
  "Replacement",
  "Termination",
  "Random Check-in",
];

const VALID_ANSWER_TYPES: AnswerType[] = [
  "textarea",
  "yesNo",
  "text",
];

function isValidQuestion(data: any): boolean {
  return (
    data &&
    typeof data.sectionId === "string" &&
    typeof data.sectionTitle === "string" &&
    typeof data.question === "string" &&
    data.question.trim().length > 0 &&
    VALID_ANSWER_TYPES.includes(data.answerType) &&
    VALID_FEEDBACK_TYPES.includes(data.feedbackType)
  );
}

function normalizeQuestion(data: QuestionInput) {
  return {
    id: data.id || randomUUID(),
    sectionId: data.sectionId.trim(),
    sectionTitle: data.sectionTitle.trim(),
    number: Number(data.number) || 1,
    question: data.question.trim(),
    answerType: data.answerType,
    subHeading: data.subHeading?.trim() || "",
    feedbackType: data.feedbackType,
    active: data.active ?? true,
    isDeleted: false,
    order: Number(data.order) || 1,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // =========================================
    // GET: Fetch all questions and reason arrays
    // =========================================

    if (req.method === "GET") {
      const documents = await collection
        .find({})
        .sort({ feedbackType: 1, sectionId: 1, order: 1 })
        .toArray();

      // Identify individual Question Management records
      const questionDocuments = documents.filter(
        (item) =>
          typeof item.question === "string" &&
          typeof item.feedbackType === "string"
      );

      const activeQuestions = questionDocuments.filter(
        (item) => item.isDeleted !== true && item.active === true
      );

      const inactiveQuestions = questionDocuments.filter(
        (item) => item.isDeleted !== true && item.active === false
      );

      const trashQuestions = questionDocuments.filter(
        (item) => item.isDeleted === true
      );

      // Fetch existing Termination reasons
      const TerminationQuestions = documents.flatMap((item) =>
        Array.isArray(item.TerminationQuestions)
          ? item.TerminationQuestions
          : []
      );

      // Fetch existing Replacement reasons
      const ReplacementQuestions = documents.flatMap((item) =>
        Array.isArray(item.ReplacementQuestions)
          ? item.ReplacementQuestions
          : []
      );

      // Group active questions by section
      const groupedSections = new Map<string, any>();

      activeQuestions.forEach((item) => {
        const key = `${item.feedbackType}__${item.sectionId}`;

        if (!groupedSections.has(key)) {
          groupedSections.set(key, {
            id: item.sectionId,
            title: item.sectionTitle,
            feedbackType: item.feedbackType,
            questions: [],
          });
        }

        groupedSections.get(key).questions.push({
          id: item.id,
          sectionId: item.sectionId,
          number: item.number,
          question: item.question,
          answerType: item.answerType,
          subHeading: item.subHeading || "",
        });
      });

      const sections = Array.from(groupedSections.values());

      return res.status(200).json({
        success: true,
        sections,
        questions: activeQuestions,
        inactiveQuestions,
        TerminationQuestions,
        ReplacementQuestions,
        trashQuestions,
        total: documents.length,
      });
    }

    // =========================================
    // POST: Create question or seed questions
    // =========================================

    if (req.method === "POST") {
      const { action, questions, ...questionData } = req.body;

      // Seed individual questions
      if (action === "seed") {
        if (!Array.isArray(questions) || questions.length === 0) {
          return res.status(400).json({
            success: false,
            message: "Questions array is required.",
          });
        }

        // Check only individual question records.
        // Existing reason-array documents should not block seeding.
        const existingCount = await collection.countDocuments({
          question: { $type: "string" },
          feedbackType: { $exists: true },
        });

        if (existingCount > 0) {
          return res.status(409).json({
            success: false,
            message: "Questions already exist. Seeding was skipped.",
          });
        }

        const validQuestions = questions.filter(isValidQuestion);

        if (validQuestions.length !== questions.length) {
          return res.status(400).json({
            success: false,
            message: "Some questions contain invalid data.",
          });
        }

        const now = new Date();

        const seedDocuments = validQuestions.map(
          (item: QuestionInput) => ({
            ...normalizeQuestion(item),
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
          })
        );

        await collection.insertMany(seedDocuments);

        return res.status(201).json({
          success: true,
          message: "Initial questions migrated successfully.",
          insertedCount: seedDocuments.length,
        });
      }

      // Create a single question
      if (!isValidQuestion(questionData)) {
        return res.status(400).json({
          success: false,
          message: "Invalid question data.",
        });
      }

      const document = {
        ...normalizeQuestion(questionData),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const existing = await collection.findOne({
        id: document.id,
      });

      if (existing) {
        return res.status(409).json({
          success: false,
          message: "Question ID already exists.",
        });
      }

      await collection.insertOne(document);

      return res.status(201).json({
        success: true,
        message: "Question created successfully.",
        question: document,
      });
    }

    // =========================================
    // PUT: Update question
    // =========================================

    if (req.method === "PUT") {
      const { id, ...updates } = req.body;

      if (!id || typeof id !== "string") {
        return res.status(400).json({
          success: false,
          message: "Question ID is required.",
        });
      }

      const allowedFields = [
        "sectionId",
        "sectionTitle",
        "number",
        "question",
        "answerType",
        "subHeading",
        "feedbackType",
        "active",
        "order",
      ];

      const updateData: Record<string, any> = {};

      for (const field of allowedFields) {
        if (Object.prototype.hasOwnProperty.call(updates, field)) {
          updateData[field] = updates[field];
        }
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          message: "No valid fields provided.",
        });
      }

      if (
        updateData.question !== undefined &&
        (typeof updateData.question !== "string" ||
          !updateData.question.trim())
      ) {
        return res.status(400).json({
          success: false,
          message: "Question text cannot be empty.",
        });
      }

      if (
        updateData.answerType !== undefined &&
        !VALID_ANSWER_TYPES.includes(updateData.answerType)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid answer type.",
        });
      }

      if (
        updateData.feedbackType !== undefined &&
        !VALID_FEEDBACK_TYPES.includes(updateData.feedbackType)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid feedback type.",
        });
      }

      if (
        updateData.active !== undefined &&
        typeof updateData.active !== "boolean"
      ) {
        return res.status(400).json({
          success: false,
          message: "Active must be a boolean.",
        });
      }

      if (
        updateData.sectionId !== undefined &&
        typeof updateData.sectionId !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid section ID.",
        });
      }

      if (
        updateData.sectionTitle !== undefined &&
        typeof updateData.sectionTitle !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid section title.",
        });
      }

      if (updateData.question) {
        updateData.question = updateData.question.trim();
      }

      if (updateData.sectionId !== undefined) {
        updateData.sectionId = updateData.sectionId.trim();
      }

      if (updateData.sectionTitle !== undefined) {
        updateData.sectionTitle = updateData.sectionTitle.trim();
      }

      updateData.updatedAt = new Date();

      const result = await collection.updateOne(
        {
          id,
          question: { $type: "string" },
          isDeleted: { $ne: true },
        },
        {
          $set: updateData,
        }
      );

      if (!result.matchedCount) {
        return res.status(404).json({
          success: false,
          message: "Question not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Question updated successfully.",
      });
    }

    // =========================================
    // PATCH: Trash, restore, restore all
    // =========================================

    if (req.method === "PATCH") {
      const { action, id } = req.body;
      const now = new Date();

      if (action === "trash") {
        if (!id) {
          return res.status(400).json({
            success: false,
            message: "Question ID is required.",
          });
        }

        const result = await collection.updateOne(
          {
            id,
            question: { $type: "string" },
            isDeleted: { $ne: true },
          },
          {
            $set: {
              active: false,
              isDeleted: true,
              deletedAt: now,
              updatedAt: now,
            },
          }
        );

        if (!result.matchedCount) {
          return res.status(404).json({
            success: false,
            message: "Question not found.",
          });
        }

        return res.status(200).json({
          success: true,
          message: "Question moved to trash.",
        });
      }

      if (action === "restore") {
        if (!id) {
          return res.status(400).json({
            success: false,
            message: "Question ID is required.",
          });
        }

        const result = await collection.updateOne(
          {
            id,
            question: { $type: "string" },
            isDeleted: true,
          },
          {
            $set: {
              active: true,
              isDeleted: false,
              deletedAt: null,
              updatedAt: now,
            },
          }
        );

        if (!result.matchedCount) {
          return res.status(404).json({
            success: false,
            message: "Trashed question not found.",
          });
        }

        return res.status(200).json({
          success: true,
          message: "Question restored successfully.",
        });
      }

      if (action === "restoreAll") {
        const result = await collection.updateMany(
          {
            question: { $type: "string" },
            isDeleted: true,
          },
          {
            $set: {
              active: true,
              isDeleted: false,
              deletedAt: null,
              updatedAt: now,
            },
          }
        );

        return res.status(200).json({
          success: true,
          message: "All questions restored.",
          restoredCount: result.modifiedCount,
        });
      }

      return res.status(400).json({
        success: false,
        message: "Invalid action.",
      });
    }

    // =========================================
    // DELETE: Permanently delete trashed question
    // =========================================

    if (req.method === "DELETE") {
      const { id } = req.body;

      if (!id || typeof id !== "string") {
        return res.status(400).json({
          success: false,
          message: "Question ID is required.",
        });
      }

      const result = await collection.deleteOne({
        id,
        question: { $type: "string" },
        isDeleted: true,
      });

      if (!result.deletedCount) {
        return res.status(404).json({
          success: false,
          message: "Trashed question not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Question permanently deleted.",
      });
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "PATCH", "DELETE"]);

    return res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed.`,
    });
  } catch (error) {
    console.error("Quality Questions API Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}
