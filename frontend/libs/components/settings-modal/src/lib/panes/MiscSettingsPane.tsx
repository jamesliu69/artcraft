import { Label } from "@storyteller/ui-label";
import { Switch } from "@storyteller/ui-switch";
import { useEnterToGenerateStore } from "@storyteller/ui-promptbox";
import { useModelPickerStyleStore } from "@storyteller/ui-popover";
import { useKeybindsStore } from "@storyteller/keybinds";
import { useTranslation } from "@storyteller/common";

interface MiscSettingsPaneProps {}

export const MiscSettingsPane = (args: MiscSettingsPaneProps) => {
  const { t, locale, setLocale } = useTranslation();
  const enterToGenerate = useEnterToGenerateStore((s) => s.enabled);
  const setEnterToGenerate = useEnterToGenerateStore((s) => s.setEnabled);

  const modelPickerStyle = useModelPickerStyleStore((s) => s.style);
  const setModelPickerStyle = useModelPickerStyleStore((s) => s.setStyle);

  const cheatsheetSticky = useKeybindsStore((s) => s.cheatsheetSticky);
  const setCheatsheetSticky = useKeybindsStore((s) => s.setCheatsheetSticky);

  return (
    <div className="space-y-4 text-base-fg">
      <div className="flex flex-col gap-2 pt-3">
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="app-language">{t("Language")}</Label>
          <p id="app-language-help" className="text-xs opacity-70">
            {t("Choose a display language. Changes apply immediately.")}
          </p>
        </div>
        <select
          id="app-language"
          aria-describedby="app-language-help"
          className="w-full max-w-xs rounded-[3px] border border-ui-controls-border bg-ui-controls px-3 py-2 text-sm text-base-fg outline-none focus:border-base-fg/40"
          value={locale}
          onChange={(event) => {
            const nextLocale = event.currentTarget.value;
            if (nextLocale === "en" || nextLocale === "zh-TW") {
              setLocale(nextLocale);
            }
          }}
        >
          <option value="en">English</option>
          <option value="zh-TW">繁體中文</option>
        </select>
      </div>
      <div className="flex flex-col gap-2 pt-3">
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="enter-to-generate">{t("Enter to generate")}</Label>
          <p className="text-xs opacity-70">
            {t("When on, pressing Enter submits the prompt and Shift+Enter adds a new line. When off (default), both Enter and Shift+Enter add a new line - use only the button to submit.")}
          </p>
        </div>
        <Switch enabled={enterToGenerate} setEnabled={setEnterToGenerate} />
      </div>
      <div className="flex flex-col gap-2 pt-3">
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="group-models-by-family">
            {t("Group models by family")}
          </Label>
          <p className="text-xs opacity-70">
            {t("When on (default), the model picker groups models into submenus by family, like Seedance or Veo. When off, every model shows in one flat list.")}
          </p>
        </div>
        <Switch
          enabled={modelPickerStyle === "grouped"}
          setEnabled={(on) => setModelPickerStyle(on ? "grouped" : "flat")}
        />
      </div>
      <div className="flex flex-col gap-2 pt-3">
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="cheatsheet-sticky">
            {t("Keep shortcut cheatsheet open")}
          </Label>
          <p className="text-xs opacity-70">
            {t("In the editors, holding Ctrl (⌘ on Mac) alone for a few seconds shows a cheatsheet of the keyboard shortcuts. When on, it stays on screen after you release the key until you press Esc or click outside it. When off (default), it disappears as soon as you let go.")}
          </p>
        </div>
        <Switch enabled={cheatsheetSticky} setEnabled={setCheatsheetSticky} />
      </div>
    </div>
  );
};
