import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useTranslation } from "@storyteller/common";
import { afterEach, expect, it } from "vitest";
import { MiscSettingsPane } from "./MiscSettingsPane";

const IndependentTranslationSubscriber = () => {
  const { t } = useTranslation();
  return <p>{t("Settings")}</p>;
};

afterEach(() => {
  cleanup();
  window.localStorage.removeItem("artcraft.locale");
});

it("switches the language setting and independent subscribers immediately, then switches back", async () => {
  const user = userEvent.setup();
  render(
    <>
      <MiscSettingsPane />
      <IndependentTranslationSubscriber />
    </>,
  );

  const languageSelect = screen.getByRole("combobox", { name: "Language" });
  expect((languageSelect as HTMLSelectElement).value).toBe("en");
  expect(screen.getByRole("option", { name: "English" })).toBeTruthy();
  expect(screen.getByRole("option", { name: "繁體中文" })).toBeTruthy();
  expect(screen.getByText("Enter to generate")).toBeTruthy();
  expect(screen.getByText("Settings")).toBeTruthy();

  await user.selectOptions(languageSelect, "zh-TW");
  expect((languageSelect as HTMLSelectElement).value).toBe("zh-TW");
  expect(screen.getByText("按 Enter 鍵生成")).toBeTruthy();
  expect(screen.getByText("設定")).toBeTruthy();
  expect(window.localStorage.getItem("artcraft.locale")).toBe("zh-TW");

  await user.selectOptions(languageSelect, "en");
  expect((languageSelect as HTMLSelectElement).value).toBe("en");
  expect(screen.getByText("Enter to generate")).toBeTruthy();
  expect(screen.getByText("Settings")).toBeTruthy();
});
