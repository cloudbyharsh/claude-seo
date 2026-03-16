import { spawn } from "child_process";
import { NextRequest } from "next/server";
import { execSync } from "child_process";
import * as path from "path";
import * as os from "os";

const IS_WINDOWS = process.platform === "win32";

// Resolve the full path to the `claude` binary (cross-platform)
function getClaudePath(): string {
  // 1. Try shell lookup first (works if PATH is set correctly)
  try {
    const cmd = IS_WINDOWS ? "where claude" : "which claude";
    const result = execSync(cmd, { encoding: "utf-8", shell: true }).trim();
    // `where` on Windows can return multiple lines — take the first
    return result.split(/\r?\n/)[0].trim();
  } catch {}

  // 2. Try common install locations
  const home = os.homedir();
  const candidates = IS_WINDOWS
    ? [
        path.join(home, "AppData", "Roaming", "npm", "claude.cmd"),
        path.join(home, "AppData", "Roaming", "npm", "claude"),
        "C:\\Program Files\\nodejs\\claude.cmd",
        path.join(home, ".npm-global", "bin", "claude.cmd"),
      ]
    : [
        "/usr/local/bin/claude",
        path.join(home, ".local", "bin", "claude"),
        path.join(home, ".npm-global", "bin", "claude"),
        "/opt/homebrew/bin/claude",
      ];

  for (const p of candidates) {
    try {
      execSync(IS_WINDOWS ? `if exist "${p}" echo ok` : `test -x "${p}"`, { shell: true });
      return p;
    } catch {}
  }

  throw new Error(
    "claude binary not found. Make sure Claude Code is installed and try restarting the terminal before running npm run dev."
  );
}

export async function POST(req: NextRequest) {
  const { url, command } = await req.json();

  if (!url || !command) {
    return new Response(JSON.stringify({ error: "url and command are required" }), {
      status: 400,
    });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      let claudePath: string;
      try {
        claudePath = getClaudePath();
      } catch (err) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ error: String(err) })}\n\n`
          )
        );
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
        controller.close();
        return;
      }

      // Build the prompt: use the SEO skill slash command
      const prompt = `/seo ${command} ${url}`;

      const child = spawn(claudePath, ["--print", prompt], {
        env: {
          ...process.env,
          NO_COLOR: "1",
          TERM: "dumb",
        },
        // shell:true lets Windows find .cmd wrappers and use full PATH
        shell: IS_WINDOWS,
      });

      // Stream stdout back chunk-by-chunk
      child.stdout.on("data", (chunk: Buffer) => {
        const text = chunk.toString("utf-8");
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
        );
      });

      child.stderr.on("data", (chunk: Buffer) => {
        const text = chunk.toString("utf-8");
        // Filter out noisy debug lines but pass meaningful errors
        if (!text.includes("ExperimentalWarning") && !text.startsWith(">")) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ stderr: text })}\n\n`)
          );
        }
      });

      child.on("error", (err) => {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ error: `Process error: ${err.message}` })}\n\n`
          )
        );
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
        controller.close();
      });

      child.on("close", (code) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ done: true, code })}\n\n`)
        );
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
