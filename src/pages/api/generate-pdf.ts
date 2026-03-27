import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export default async function handler(req: any, res: any) {
  let browser;

  try {
    console.log("🚀 PDF API called");

    const { html } = req.body;

    if (!html) {
      console.log("❌ No HTML received");
      return res.status(400).json({ error: "HTML content is required" });
    }

    console.log("ENV:", process.env.NODE_ENV);

    // ==============================
    // 🚀 PRODUCTION (VERCEL)
    // ==============================
    if (process.env.NODE_ENV === "production") {
      const executablePath = await chromium.executablePath();

      console.log("Executable Path:", executablePath);

      if (!executablePath) {
        throw new Error("Chromium executable path is null");
      }

      // ✅ Load font (important for serverless stability)
      await chromium.font(
        "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf"
      );

    browser = await puppeteer.launch({
  args: [
    ...chromium.args,
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
  ],
  executablePath,
  defaultViewport: chromium.defaultViewport,
  headless: chromium.headless,
});

      console.log("✅ Browser launched (production)");
    }

    // ==============================
    // 💻 LOCAL DEVELOPMENT
    // ==============================
    else {
      const puppeteerFull = await import("puppeteer");

      browser = await puppeteerFull.default.launch({
        headless: true,
      });

      console.log("✅ Browser launched (local)");
    }

    const page = await browser.newPage();

    console.log("📄 Setting HTML content...");

   await page.setContent(html, {
  waitUntil: "networkidle0",
  timeout: 0, // remove timeout crash
});
    console.log("🖨 Generating PDF...");

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    console.log("✅ PDF generated");

    await browser.close();
    console.log("🛑 Browser closed");

    return res.status(200).json({
      pdf: Buffer.from(pdfBuffer).toString("base64"),
    });

  } catch (error: any) {
    console.error("❌ PDF ERROR FULL:", error);

    // Ensure browser closes even on error
    if (browser) {
      try {
        await browser.close();
      } catch (e) {
        console.error("Error closing browser:", e);
      }
    }

    return res.status(500).json({
      error: error,
      
    });
  }
}