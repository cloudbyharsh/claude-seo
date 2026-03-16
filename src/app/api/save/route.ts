import { NextRequest } from "next/server";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

export async function POST(req: NextRequest) {
  try {
    const { url, command, content } = await req.json();
    if (!content) return new Response(JSON.stringify({ ok: false }), { status: 400 });

    // Save reports next to the app in a /reports folder
    const reportsDir = join(process.cwd(), "reports");
    mkdirSync(reportsDir, { recursive: true });

    const hostname = new URL(url).hostname.replace(/[^a-z0-9.-]/gi, "_");
    const date = new Date().toISOString().slice(0, 10);
    const time = new Date().toTimeString().slice(0, 8).replace(/:/g, "-");
    const filename = `seo-${command}-${hostname}-${date}-${time}.md`;
    const filepath = join(reportsDir, filename);

    writeFileSync(filepath, `# SEO Report: ${command} — ${url}\nGenerated: ${new Date().toISOString()}\n\n---\n\n${content}`, "utf-8");

    return new Response(JSON.stringify({ ok: true, filename }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 });
  }
}
