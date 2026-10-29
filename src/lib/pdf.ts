import fs from "node:fs";
import type { Browser } from "puppeteer-core";
import puppeteer from "puppeteer-core";

/**
 * Tizimdagi Chrome / Edge / Chromium'ni topadi.
 * Production (Docker / Cloud Run) da CHROME_PATH env orqali belgilang.
 */
function findChrome(): string {
  const fromEnv = process.env.CHROME_PATH;
  if (fromEnv && fs.existsSync(fromEnv)) return fromEnv;

  const pf = process.env["PROGRAMFILES"] || "C:\\Program Files";
  const pf86 = process.env["PROGRAMFILES(X86)"] || "C:\\Program Files (x86)";
  const local = process.env["LOCALAPPDATA"] || "";

  const candidates = [
    // Windows
    `${pf}\\Google\\Chrome\\Application\\chrome.exe`,
    `${pf86}\\Google\\Chrome\\Application\\chrome.exe`,
    `${local}\\Google\\Chrome\\Application\\chrome.exe`,
    `${pf86}\\Microsoft\\Edge\\Application\\msedge.exe`,
    `${pf}\\Microsoft\\Edge\\Application\\msedge.exe`,
    // macOS
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    // Linux
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ];

  const found = candidates.find((p) => p && fs.existsSync(p));
  if (!found) {
    throw new Error(
      "Chrome/Edge topilmadi. CHROME_PATH muhit o'zgaruvchisi orqali brauzer yo'lini ko'rsating.",
    );
  }
  return found;
}

const g = globalThis as unknown as { __cvBrowser?: Promise<Browser> };

/** Brauzerni bir marta ishga tushirib, qayta ishlatadi (tezlik uchun) */
export async function getBrowser(): Promise<Browser> {
  if (g.__cvBrowser) {
    const b = await g.__cvBrowser.catch(() => null);
    if (b && b.connected) return b;
  }
  g.__cvBrowser = puppeteer.launch({
    executablePath: findChrome(),
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--font-render-hinting=none"],
  });
  return g.__cvBrowser;
}

/* -------- PDF render uchun vaqtinchalik ma'lumot ombori -------- */

type Entry = { payload: unknown; expires: number };
const store = ((globalThis as unknown as { __cvPrintStore?: Map<string, Entry> }).__cvPrintStore ??=
  new Map<string, Entry>());

export function putPrintPayload(payload: unknown): string {
  const now = Date.now();
  for (const [k, v] of store) if (v.expires < now) store.delete(k);
  const token = crypto.randomUUID();
  store.set(token, { payload, expires: now + 60_000 });
  return token;
}

export function takePrintPayload(token: string): unknown | null {
  const e = store.get(token);
  if (!e || e.expires < Date.now()) return null;
  return e.payload;
}

export function deletePrintPayload(token: string) {
  store.delete(token);
}
