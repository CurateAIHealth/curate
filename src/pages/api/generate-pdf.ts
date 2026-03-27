import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export default async function handler(req: any, res: any) {
  try {
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({ error: "HTML content is required" });
    }

    let browser;

    if (process.env.NODE_ENV === "production") {
      const executablePath = await chromium.executablePath();

      console.log("Executable Path:", executablePath);

      browser = await puppeteer.launch({
        args: [
          ...chromium.args,
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--single-process",
        ],
        executablePath,
        headless: true,
      });
    } else {
      const puppeteerFull = await import("puppeteer");

      browser = await puppeteerFull.default.launch({
        headless: true,
      });
    }

    const page = await browser.newPage();

    // Set HTML safely
    await page.setContent(html, {
      waitUntil: "domcontentloaded", // safer than networkidle0
      timeout: 30000,
    });

    // Optional: wait for fonts/images if needed
    // await page.waitForTimeout(500);

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    return res.status(200).json({
      pdf: Buffer.from(pdfBuffer).toString("base64"),
    });
  } catch (error: any) {
    console.error("PDF ERROR FULL:", error);

    return res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  }
}