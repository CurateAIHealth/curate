import type { NextApiRequest, NextApiResponse } from "next";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

type ResponseData = { pdf: string } | { error: string; details?: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  let browser: any = null;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { html } = req.body;
    if (!html) return res.status(400).json({ error: "HTML content is required" });

    const isProduction = process.env.NODE_ENV === "production";
    
    if (isProduction) {
      // We cast to 'any' to avoid the "Property does not exist" TS errors
      const chromiumAny = chromium as any; 

      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromiumAny.defaultViewport || { width: 1280, height: 800 },
        executablePath: await chromium.executablePath(),
        // Use the chromium.headless helper or a boolean
        headless: chromiumAny.headless === "shell" ? "shell" : true, 
      });
    } else {
      // Local development
      const puppeteerLib = await import("puppeteer");
      browser = await puppeteerLib.default.launch({
        headless: true,
        args: ["--no-sandbox"],
      });
    }

    const page = await browser.newPage();

    // Set content and wait for it to render
    await page.setContent(html, { 
      waitUntil: "domcontentloaded",
      timeout: 20000 
    });

    // Ensure images are loaded before PDF generation
    await page.evaluate(async () => {
      const images = Array.from(document.querySelectorAll("img"));
      await Promise.all(images.map(img => {
        if (img.complete) return;
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      }));
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "10mm", bottom: "10mm", left: "10mm", right: "10mm" },
    });

    await browser.close();
    
    return res.status(200).json({ 
      pdf: Buffer.from(pdfBuffer).toString("base64") 
    });

  } catch (error: any) {
    console.error("❌ PDF SERVER ERROR:", error);
    if (browser) await browser.close();
    return res.status(500).json({ 
      error: "Failed to generate PDF", 
      details: error.message 
    });
  }
}