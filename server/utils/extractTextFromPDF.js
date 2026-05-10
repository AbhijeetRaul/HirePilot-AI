import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export const extractTextFromPDF = async (buffer) => {
  try {
    const uint8Array = new Uint8Array(buffer);

    const pdf = await pdfjsLib.getDocument({
      data: uint8Array,
    }).promise;

    let extractedText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);

      const textContent = await page.getTextContent();

      const pageText = textContent.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ");

      extractedText += pageText + "\n";
    }

    return extractedText.trim();
  } catch (error) {
    console.log("PDF ERROR:", error);

    return "";
  }
};