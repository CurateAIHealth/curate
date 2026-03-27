import type { NextApiRequest, NextApiResponse } from "next";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

type ResponseData =
  | { pdf: string }
  | { error: string; stack?: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  let browser: any = null;

  try {
    console.log("🚀 PDF API called");

    // ✅ Allow only POST
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { html } = req.body as { html?: string };

    if (!html) {
      return res.status(400).json({ error: "HTML content is required" });
    }

    console.log("ENV:", process.env.NODE_ENV);

    // ==============================
    // 🚀 PRODUCTION (Vercel / Serverless)
    // ==============================
    if (process.env.NODE_ENV === "production") {
      const executablePath =
        (await chromium.executablePath()) || "/tmp/chromium";

      console.log("Executable Path:", executablePath);

      const chromiumAny = chromium as any;

      // Optional font support
      if (chromiumAny.font) {
        await chromiumAny.font(
          "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf"
        );
      }

      browser = await puppeteer.launch({
        args: [
          ...chromium.args,
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
        ],
        executablePath,
        defaultViewport: chromiumAny.defaultViewport || {
          width: 1280,
          height: 800,
        },
        headless: true,
      });

      console.log("✅ Browser launched (production)");
    }

    // ==============================
    // 💻 LOCAL
    // ==============================
    else {
      const puppeteerFull = await import("puppeteer");

      browser = await puppeteerFull.default.launch({
        headless: true,
      });

      console.log("✅ Browser launched (local)");
    }

    const page = await browser.newPage();

    // ==============================
    // 🚀 PREVENT HANGING (IMPORTANT FIX)
    // ==============================
    await page.setRequestInterception(true);

    page.on("request", (req:any) => {
      const type = req.resourceType();

      if (type === "image" || type === "font") {
        req.abort(); // 🔥 prevents timeout issues
      } else {
        req.continue();
      }
    });

    console.log("📄 Setting HTML...");

    // ✅ FIXED HERE (main issue)
    await page.setContent(html, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    console.log("🖨 Generating PDF...");

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    console.log("✅ PDF generated");

    await browser.close();
    browser = null;

    return res.status(200).json({
      pdf: Buffer.from(pdfBuffer).toString("base64"),
    });
  } catch (error: unknown) {
    console.error("❌ PDF ERROR FULL:", error);

    if (browser) {
      try {
        await browser.close();
      } catch {}
    }

    const err = error as Error;

    return res.status(500).json({
      error: err.message || "Internal Server Error",
      stack: err.stack,
    });
  }
}