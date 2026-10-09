import assert from "node:assert/strict";
import { chromium, expect } from "@playwright/test";
import { installBrowserFixture } from "../performance/browser-fixture.mjs";
import { installSessionFixture } from "./session-fixture.mjs";

const ENGLISH = {
  hero: "What will you craft today?",
  settings: "Settings",
  general: "General",
  language: "Language",
  cards: {
    image: "Create Image",
    video: "Create Video",
    audio: "Create Audio",
  },
  prompts: {
    image: "Describe what you want in the image...",
    video: "Describe what you want to happen in the video...",
    audio: "Describe the music or sound you want...",
  },
};

const CHINESE = {
  hero: "今天想創作什麼？",
  settings: "設定",
  general: "一般",
  language: "語言",
  cards: {
    image: "生成圖片",
    video: "生成影片",
    audio: "生成音訊",
  },
  prompts: {
    image: "描述你想在圖片中呈現的內容…",
    video: "描述影片中要發生的內容…",
    audio: "描述你想要的音樂或聲音…",
  },
};

const url = new URL(process.argv[2] || "http://127.0.0.1:5193");
if (url.protocol !== "http:" || !["127.0.0.1", "localhost", "[::1]"].includes(url.hostname)) {
  throw new Error("Use a local HTTP development or preview URL.");
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await context.addInitScript(installBrowserFixture);
  await context.addInitScript(installSessionFixture);

  const blockedRequests = [];
  await context.route("**/*", async (route) => {
    const target = route.request().url();
    if (target.startsWith("blob:") || new URL(target).origin === url.origin) {
      await route.continue();
      return;
    }
    blockedRequests.push(target);
    await route.abort();
  });

  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto(url.href);
  await expectHero(page, ENGLISH.hero);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expectCardHeadings(page, ENGLISH.cards);

  await openSettings(page, ENGLISH);
  const englishLanguage = page.getByLabel("Language", { exact: true });
  await expect(englishLanguage).toHaveValue("en");
  await englishLanguage.selectOption("zh-TW");
  await expect(page.getByLabel("語言", { exact: true })).toHaveValue("zh-TW");
  await expect(page.getByRole("button", { name: CHINESE.general, exact: true })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-TW");
  assert.equal(await readSavedLocale(page), "zh-TW");

  await page.keyboard.press("Escape");
  await expectHero(page, CHINESE.hero);
  await expect(page.getByRole("button", { name: "設定", exact: true })).toBeVisible();
  await expectCardHeadings(page, CHINESE.cards);
  for (const [label, prompt] of Object.entries(CHINESE.prompts)) {
    await page.getByRole("heading", { level: 3, name: CHINESE.cards[label], exact: true }).click();
    await expect(page.getByPlaceholder(prompt, { exact: true })).toBeVisible({ timeout: 30000 });
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-TW");
    if (label === "image") await switchLocaleOnActiveImagePage(page);
    await page.goto(url.href);
    await expectHero(page, CHINESE.hero);
  }

  await page.reload();
  await expectHero(page, CHINESE.hero);
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-TW");
  await expectCardHeadings(page, CHINESE.cards);
  assert.equal(await readSavedLocale(page), "zh-TW");

  await openSettings(page, CHINESE);
  await page.getByLabel(CHINESE.language, { exact: true }).selectOption("en");
  await expect(page.getByLabel("Language", { exact: true })).toHaveValue("en");
  await expect(page.getByRole("button", { name: ENGLISH.general, exact: true })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  assert.equal(await readSavedLocale(page), "en");
  await page.keyboard.press("Escape");
  await expectHero(page, ENGLISH.hero);
  await expectCardHeadings(page, ENGLISH.cards);

  await page.reload();
  await expectHero(page, ENGLISH.hero);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expectCardHeadings(page, ENGLISH.cards);
  assert.equal(await readSavedLocale(page), "en");

  assert.deepEqual(pageErrors, [], "Application runtime errors");
  console.log(
    `PASS: English -> zh-TW -> reload -> English -> reload; exact visible home hero, settings, create cards, and image/video/audio prompt placeholders update. IPC is synthetic; external browser requests blocked (${blockedRequests.length} blocked). No generation or native writes were triggered.`,
  );
} finally {
  await browser.close();
}

async function openSettings(page, language) {
  await page.getByRole("button", { name: language.settings, exact: true }).click();
  await expect(page.getByRole("button", { name: language.general, exact: true })).toBeVisible();
}

async function switchLocaleOnActiveImagePage(page) {
  await openSettings(page, CHINESE);
  await page.getByLabel(CHINESE.language, { exact: true }).selectOption("en");
  await expect(page.getByLabel(ENGLISH.language, { exact: true })).toHaveValue("en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.keyboard.press("Escape");
  await expect(page.getByPlaceholder(ENGLISH.prompts.image, { exact: true })).toBeVisible();

  await openSettings(page, ENGLISH);
  await page.getByLabel(ENGLISH.language, { exact: true }).selectOption("zh-TW");
  await expect(page.getByLabel(CHINESE.language, { exact: true })).toHaveValue("zh-TW");
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-TW");
  await page.keyboard.press("Escape");
  await expect(page.getByPlaceholder(CHINESE.prompts.image, { exact: true })).toBeVisible();
}

async function expectHero(page, expected) {
  const heading = page.locator("main > h1");
  await expect(heading).toHaveCount(1);
  await expect(heading).toBeVisible({ timeout: 60000 });
  await expect.poll(async () => (await heading.innerText()).replace(/\s+/g, "").trim()).toBe(expected.replace(/\s+/g, "").trim());
}

async function expectCardHeadings(page, cards) {
  for (const title of Object.values(cards)) {
    await expect(page.getByRole("heading", { level: 3, name: title, exact: true })).toBeVisible();
  }
}

async function readSavedLocale(page) {
  return page.evaluate(() => window.localStorage.getItem("artcraft.locale"));
}
