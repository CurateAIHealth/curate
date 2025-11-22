import puppeteer from "puppeteer";

export default async function handler(req:any, res:any) {
  try {
    const { html } = req.body;

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    res.status(200).json({
      pdf: Buffer.from(pdfBuffer).toString("base64"), 
    });

  } catch (error) {
    console.error("PDF ERROR:", error);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
}
