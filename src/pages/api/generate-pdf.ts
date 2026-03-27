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

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { html } = req.body as { html?: string };

    if (!html) {
      return res.status(400).json({ error: "HTML content is required" });
    }

    console.log("ENV:", process.env.NODE_ENV);

    // ==============================
    // 🚀 PRODUCTION (Vercel / Hostinger)
    // ==============================
    if (process.env.NODE_ENV === "production") {
      const executablePath = await chromium.executablePath();

      console.log("Executable Path:", executablePath);

      if (!executablePath) {
        throw new Error("Chromium executable path is null");
      }

      const chromiumAny = chromium as any;

      // Optional font loading
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
    // 🛡 OPTIONAL: Debug image issues
    // ==============================
    /*
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (req.resourceType() === "image") {
        req.continue(); // change to req.abort() to test image issues
      } else {
        req.continue();
      }
    });
    */

    console.log("📄 Setting HTML...");

    await page.setContent(html, {
      waitUntil: "networkidle0",
      timeout: 60000,
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