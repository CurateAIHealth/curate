import { GetAIDashboardData } from "@/Lib/auth";
import type { NextApiRequest, NextApiResponse } from "next";


type ResponseData = {
  success: boolean;
  answer?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const {
      question,
      month,
      year,
      team,
      serviceState,
    } = req.body;

    if (!question?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required.",
      });
    }

    const monthNumber = getMonthNumber(month);

    const monthKey =
      year && monthNumber
        ? `${year}-${monthNumber}`
        : undefined;

    // Get data directly from MongoDB
    const deploymentData =
      await GetAIDashboardData(monthKey);

    if (!deploymentData?.length) {
      return res.status(200).json({
        success: true,
        answer: `No deployment data found for ${
          monthKey || "the requested period"
        }.`,
      });
    }

    // Apply dashboard filters on server
    let filteredData = deploymentData;

    if (
      team &&
      team !== "All" &&
      team !== "All Teams"
    ) {
      filteredData = filteredData.filter(
        (item: any) => item.team === team
      );
    }

    if (
      serviceState &&
      serviceState !== "All" &&
      serviceState !== "All States"
    ) {
      filteredData = filteredData.filter(
        (item: any) =>
          item.serviceState === serviceState
      );
    }

    const uniqueClients = new Set(
      filteredData
        .map((item: any) => item.clientId)
        .filter(Boolean)
    ).size;

    const activeDeployments =
      filteredData.filter(
        (item: any) =>
          String(item.status).toLowerCase() ===
          "active"
      ).length;

    const freezeDeployments =
      filteredData.filter(
        (item: any) =>
          String(item.status).toLowerCase() ===
          "freeze"
      ).length;

    const terminatedDeployments =
      filteredData.filter(
        (item: any) =>
          String(item.status).toLowerCase() ===
          "terminated"
      ).length;

    const totalClientRevenue =
      filteredData.reduce(
        (sum: number, item: any) =>
          sum + Number(item.clientTotal || 0),
        0
      );

    const totalHcpPayment =
      filteredData.reduce(
        (sum: number, item: any) =>
          sum + Number(item.hcpTotal || 0),
        0
      );

    const totalMargin =
      totalClientRevenue - totalHcpPayment;

    const dashboardSummary = {
      month: monthKey || "all",
      team: team || "all",
      serviceState: serviceState || "all",

      deploymentRecords:
        filteredData.length,

      uniqueClients,

      activeDeployments,

      freezeDeployments,

      terminatedDeployments,

      totalClientRevenue,

      totalHcpPayment,

      totalMargin,
    };

    const apiKey =
      process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message:
          "OPENAI_API_KEY is not configured.",
      });
    }

    const systemPrompt = `
You are an AI assistant for a healthcare
deployment dashboard.

Answer ONLY using the database information
provided below.

Rules:

- Never invent numbers.
- Never invent clients or HCA names.
- Use dashboardSummary for totals.
- Distinguish deployment records from unique clients.
- Keep answers concise.
- Use Indian Rupees for financial values.
- Do not expose phone numbers, emails,
  Aadhaar numbers or other sensitive information.
- If information is unavailable, say so clearly.
`;

    const userPrompt = `
ADMIN QUESTION:

${question}

DASHBOARD SUMMARY:

${JSON.stringify(
  dashboardSummary,
  null,
  2
)}

DEPLOYMENT DATA:

${JSON.stringify(
  filteredData,
  null,
  2
)}
`;

    const openAIResponse = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },

        body: JSON.stringify({
          model: "gpt-5.6-luna",

          instructions:
            systemPrompt,

          input: userPrompt,

          max_output_tokens: 1200,
        }),
      }
    );

    const openAIData =
      await openAIResponse.json();

    if (!openAIResponse.ok) {
      console.error(
        "OpenAI Error:",
        openAIData
      );

      return res.status(500).json({
        success: false,
        message:
          openAIData?.error?.message ||
          "OpenAI request failed.",
      });
    }

    const answer =
      openAIData?.output_text ||
      extractResponseText(openAIData);

    return res.status(200).json({
      success: true,
      answer:
        answer || "No answer returned.",
    });

  } catch (error: any) {
    console.error(
      "Admin Assistant Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Something went wrong.",
    });
  }
}


/* -----------------------------
   Helpers
----------------------------- */

function getMonthNumber(
  month: any
) {
  if (!month) return null;

  if (!isNaN(Number(month))) {
    return Number(month);
  }

  const months: Record<
    string,
    number
  > = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
  };

  return (
    months[
      String(month)
        .trim()
        .toLowerCase()
    ] || null
  );
}


function extractResponseText(
  data: any
) {
  try {
    const output =
      data?.output || [];

    const textParts: string[] = [];

    for (const item of output) {
      if (!item?.content) continue;

      for (const content of item.content) {
        if (
          content?.type ===
            "output_text" &&
          content?.text
        ) {
          textParts.push(
            content.text
          );
        }
      }
    }

    return textParts
      .join("\n")
      .trim();

  } catch {
    return "";
  }
}