import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { generationMessages } from "./catalogs/generation";
import { mediaMessages } from "./catalogs/media";
import { settingsMessages } from "./catalogs/settings";
import { shellMessages } from "./catalogs/shell";
import { initializeLocale, setLocale, useTranslation } from "./index";

const STORAGE_KEY = "artcraft.locale";
const inheritedKeyCases: Array<[string, Record<string, string | number> | undefined]> = [
  ["constructor", undefined],
  ["toString", undefined],
  ["__proto__", undefined],
  ["constructor", { name: "Ada" }],
  ["toString", { name: "Ada" }],
  ["__proto__", { name: "Ada" }],
];

let localStorageDescriptor: PropertyDescriptor | undefined;

function TranslationSubscriber({
  id,
  onTranslator,
}: {
  id: string;
  onTranslator?: (translate: (source: string) => string) => void;
}) {
  const { locale, t } = useTranslation();
  onTranslator?.(t);
  return <span data-testid={id}>{`${locale}:${t("Hello, {name}!", { name: "Ada" })}`}</span>;
}

describe("locale core", () => {
  beforeEach(() => {
    localStorageDescriptor = Object.getOwnPropertyDescriptor(window, "localStorage");
    setLocale("en");
    window.localStorage.clear();
    document.documentElement.lang = "";
  });

  afterEach(() => {
    cleanup();
    if (localStorageDescriptor) {
      Object.defineProperty(window, "localStorage", localStorageDescriptor);
    }
  });

  it("defaults to English and sets the document language before rendering", () => {
    initializeLocale();

    expect(renderTranslationResult().locale).toBe("en");
    expect(document.documentElement.lang).toBe("en");
  });

  it.each(["en", "zh-TW"] as const)("restores the saved %s locale", (locale) => {
    window.localStorage.setItem(STORAGE_KEY, locale);

    initializeLocale();

    expect(renderTranslationResult().locale).toBe(locale);
    expect(document.documentElement.lang).toBe(locale);
  });

  it("falls back to English for an invalid saved locale", () => {
    window.localStorage.setItem(STORAGE_KEY, "fr");

    initializeLocale();

    expect(renderTranslationResult().locale).toBe("en");
    expect(document.documentElement.lang).toBe("en");
  });

  it("continues with the in-memory locale when the storage getter throws", () => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new Error("storage is unavailable");
      },
    });

    expect(() => initializeLocale()).not.toThrow();
    expect(() => setLocale("zh-TW")).not.toThrow();
    expect(renderTranslationResult().locale).toBe("zh-TW");
    expect(document.documentElement.lang).toBe("zh-TW");
  });

  it("updates subscribers even when saving the locale throws", () => {
    const failingStorage = {
      getItem: () => null,
      setItem: () => {
        throw new Error("storage is read-only");
      },
    } as unknown as Storage;
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: failingStorage,
    });
    render(
      <>
        <TranslationSubscriber id="first" />
        <TranslationSubscriber id="second" />
      </>,
    );

    expect(() => act(() => setLocale("zh-TW"))).not.toThrow();

    expect(screen.getByTestId("first").textContent).toBe("zh-TW:Hello, Ada!");
    expect(screen.getByTestId("second").textContent).toBe("zh-TW:Hello, Ada!");
    expect(document.documentElement.lang).toBe("zh-TW");
  });

  it("persists locale changes and falls back to English text with interpolation", () => {
    initializeLocale();

    act(() => setLocale("zh-TW"));
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("zh-TW");

    const { t } = renderTranslationResult();
    expect(t("Hello, {name}!", { name: "Ada" })).toBe("Hello, Ada!");
    expect(t("Missing {name} and {count}", { name: "Ada" })).toBe("Missing Ada and {count}");
  });

  it.each(inheritedKeyCases)("returns the English source for inherited key %s", (source, params) => {
    setLocale("zh-TW");
    const { t } = renderTranslationResult();

    expect(t(source, params)).toBe(source);
  });

  it("returns translations from each catalog and refreshes both subscribers immediately", () => {
    initializeLocale();
    const catalogs = [settingsMessages, shellMessages, generationMessages, mediaMessages];
    const samples = catalogs.map((catalog) => Object.entries(catalog)[0]);

    const translators: Array<(source: string) => string> = [];
    const subscriberTree = () => (
      <>
        <TranslationSubscriber id="first" onTranslator={(translate) => translators.push(translate)} />
        <TranslationSubscriber id="second" onTranslator={(translate) => translators.push(translate)} />
      </>
    );
    const view = render(subscriberTree());
    const initialTranslators = translators.slice();
    view.rerender(subscriberTree());
    expect(translators[2]).toBe(initialTranslators[0]);
    expect(translators[3]).toBe(initialTranslators[1]);
    const stableLocaleTranslators = translators.slice();

    act(() => setLocale("zh-TW"));

    expect(screen.getByTestId("first").textContent).toContain("zh-TW:");
    expect(screen.getByTestId("second").textContent).toContain("zh-TW:");
    expect(document.documentElement.lang).toBe("zh-TW");
    for (const sample of samples) {
      expect(sample).toBeDefined();
      if (sample) {
        const [source, expected] = sample;
        expect(renderTranslationResult().t(source)).toBe(expected);
      }
    }
    expect(translators.length).toBeGreaterThan(stableLocaleTranslators.length);
    expect(translators[translators.length - 1]).not.toBe(stableLocaleTranslators[stableLocaleTranslators.length - 1]);
  });

  it("keeps duplicate English source keys consistent across catalogs", () => {
    const catalogs = [settingsMessages, shellMessages, generationMessages, mediaMessages];
    const valuesBySource = new Map<string, string>();

    for (const catalog of catalogs) {
      for (const [source, translation] of Object.entries(catalog)) {
        const existing = valuesBySource.get(source);
        if (existing !== undefined) {
          expect(translation, `duplicate source key: ${source}`).toBe(existing);
        } else {
          valuesBySource.set(source, translation);
        }
      }
    }
  });
});

function renderTranslationResult() {
  let result: ReturnType<typeof useTranslation> | undefined;
  function Capture() {
    result = useTranslation();
    return null;
  }
  const view = render(<Capture />);
  view.unmount();
  if (!result) throw new Error("Translation hook did not render");
  return result;
}
