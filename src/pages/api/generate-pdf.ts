import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export default async function handler(req: any, res: any) {
  try {
    const { html } = req.body;

    let browser;

    if (process.env.NODE_ENV === "production") {
     
      const executablePath = await chromium.executablePath();

      browser = await puppeteer.launch({
        args: chromium.args,
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

    await page.setContent(html, {
       waitUntil: "networkidle0",
    });

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