/**
 * Post-build prerender for the marketing landing route.
 * Serves dist/, loads `/` in Chromium, waits for hero copy, then writes the
 * rendered DOM back into dist/index.html so first paint shows real content
 * before the JS bundle executes.
 */
import { createServer } from "node:http";
import { readFile, writeFile, access } from "node:fs/promises";
import { createReadStream, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const indexPath = path.join(dist, "index.html");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json",
};

function contentType(filePath) {
  return MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

async function startStaticServer() {
  const server = createServer((req, res) => {
    try {
      const url = new URL(req.url || "/", "http://127.0.0.1");
      let pathname = decodeURIComponent(url.pathname);
      if (pathname.endsWith("/")) pathname += "index.html";
      const filePath = path.join(dist, pathname);
      if (!filePath.startsWith(dist) || !existsSync(filePath)) {
        // SPA fallback for client routes during prerender
        const fallback = createReadStream(indexPath);
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        fallback.pipe(res);
        return;
      }
      res.writeHead(200, { "Content-Type": contentType(filePath) });
      createReadStream(filePath).pipe(res);
    } catch {
      res.writeHead(500);
      res.end("prerender server error");
    }
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  return { server, port };
}

async function prerender() {
  await access(indexPath);

  const { server, port } = await startStaticServer();
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
      colorScheme: "dark",
    });

    await page.goto(`http://127.0.0.1:${port}/`, {
      waitUntil: "networkidle",
      timeout: 120_000,
    });

    // Hero copy must be present — do not wait on WebGL / fonts / animations.
    await page.waitForFunction(
      () => {
        const h1 = document.querySelector("h1");
        const text = h1?.textContent || "";
        return text.includes("Find your people") && text.includes("Feel at home");
      },
      { timeout: 60_000 },
    );

    // Let layout settle; force hero content visible even if GSAP mid-tween.
    await page.evaluate(() => {
      document
        .querySelectorAll(
          ".bawo-hero-cinematic__title, .bawo-hero-cinematic__copy, .bawo-hero-cinematic__footer-actions, .bawo-hero-cinematic__phone",
        )
        .forEach((el) => {
          el.style.opacity = "1";
          el.style.transform = "none";
        });
      document.documentElement.setAttribute("data-prerendered", "landing");
    });

    await page.waitForTimeout(250);

    const html = await page.content();
    // Drop the Playwright-injected base/scripts noise; keep a clean document.
    const cleaned = html
      .replace(/\s*data-prerendered="landing"/g, ' data-prerendered="landing"')
      // Ensure no module of the live page is blocked; playwright content() is full DOM.
      .trim();

    const rootText = await page.locator("#root").innerText();
    if (!rootText.includes("Find your people") || !rootText.includes("Feel at home")) {
      throw new Error("Prerender output missing hero copy in #root");
    }
    if (!cleaned.includes('id="root"') || !cleaned.includes("bawo-hero-cinematic__title")) {
      throw new Error("Prerender output missing populated #root markup");
    }

    await writeFile(indexPath, `${cleaned}\n`, "utf8");
    const bytes = Buffer.byteLength(cleaned, "utf8");
    console.log(`[prerender] Wrote landing HTML to dist/index.html (${bytes} bytes)`);
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

prerender().catch((err) => {
  console.error("[prerender] Failed:", err);
  process.exit(1);
});
