import { NextRequest, NextResponse } from "next/server";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  LevelFormat,
} from "docx";

function parseMarkdownToDocx(markdown: string): Paragraph[] {
  const lines = markdown.split("\n");
  const paragraphs: Paragraph[] = [];

  for (const raw of lines) {
    const line = raw.trim();

    if (line.startsWith("# ")) {
      paragraphs.push(new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: line.slice(2), bold: true, size: 32 })],
        spacing: { before: 400, after: 200 },
      }));
    } else if (line.startsWith("## ")) {
      paragraphs.push(new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: line.slice(3), bold: true, size: 26 })],
        spacing: { before: 320, after: 160 },
      }));
    } else if (line.startsWith("### ")) {
      paragraphs.push(new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun({ text: line.slice(4), bold: true, size: 24 })],
        spacing: { before: 240, after: 120 },
      }));
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      paragraphs.push(new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: line.slice(2), size: 22 })],
      }));
    } else if (/^\d+\. /.test(line)) {
      paragraphs.push(new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun({ text: line.replace(/^\d+\. /, ""), size: 22 })],
      }));
    } else if (line === "" || line === "---") {
      paragraphs.push(new Paragraph({
        children: [new TextRun("")],
        spacing: { before: 100, after: 100 },
      }));
    } else {
      // Handle inline bold (**text**)
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      const runs = parts.map(part => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return new TextRun({ text: part.slice(2, -2), bold: true, size: 22 });
        }
        return new TextRun({ text: part, size: 22 });
      });
      paragraphs.push(new Paragraph({
        children: runs,
        spacing: { before: 80, after: 80 },
      }));
    }
  }

  return paragraphs;
}

export async function POST(req: NextRequest) {
  const { content, url, analysisType } = await req.json();

  if (!content) {
    return NextResponse.json({ error: "No content provided" }, { status: 400 });
  }

  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric"
  });

  const contentParagraphs = parseMarkdownToDocx(content);

  const doc = new Document({
    numbering: {
      config: [
        {
          reference: "bullets",
          levels: [{
            level: 0,
            format: LevelFormat.BULLET,
            text: "•",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          }],
        },
        {
          reference: "numbers",
          levels: [{
            level: 0,
            format: LevelFormat.DECIMAL,
            text: "%1.",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          }],
        },
      ],
    },
    styles: {
      default: {
        document: { run: { font: "Calibri", size: 22, color: "1a1a1a" } },
      },
      paragraphStyles: [
        {
          id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 32, bold: true, font: "Calibri", color: "15803d" },
          paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 },
        },
        {
          id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 26, bold: true, font: "Calibri", color: "166534" },
          paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 1 },
        },
        {
          id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 24, bold: true, font: "Calibri", color: "1a1a1a" },
          paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 },
        },
      ],
    },
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children: [
        // Title
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 160 },
          children: [
            new TextRun({ text: "SEO Analysis Report", bold: true, size: 48, font: "Calibri", color: "15803d" }),
          ],
        }),
        // Subtitle
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 80 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "22c55e", space: 1 } },
          children: [
            new TextRun({ text: `${analysisType}  ·  ${url}`, size: 20, color: "666666" }),
          ],
        }),
        // Date
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 80, after: 400 },
          children: [
            new TextRun({ text: `Generated on ${date}`, size: 18, color: "999999", italics: true }),
          ],
        }),
        // Content
        ...contentParagraphs,
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="seo-${analysisType.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.docx"`,
    },
  });
}
