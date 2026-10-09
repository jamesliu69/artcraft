import React, { useEffect, useRef, useState } from "react";
import { Modal } from "@storyteller/ui-modal";
import { Button } from "@storyteller/ui-button";
import { useTranslation } from "@storyteller/common";

interface FolderNameDialogProps {
  isOpen: boolean;
  title: string;
  /** Small grey line under the title (e.g. "in My Library"). */
  subtitle?: string;
  initialValue?: string;
  /** Translate a fixed UI default when the dialog opens; user-edited names stay raw. */
  initialValueTranslationKey?: string;
  confirmLabel: string;
  onConfirm: (name: string) => void;
  onClose: () => void;
}

/**
 * Name-input dialog (New folder / Rename folder) built on the shared `Modal`
 * so it gets the same fade/scale animation, backdrop, stacking, and ESC handling
 * as every other modal. Used by both the desktop gallery modal and the webapp.
 */
export const FolderNameDialog: React.FC<FolderNameDialogProps> = ({
  isOpen,
  title,
  subtitle,
  initialValue = "",
  initialValueTranslationKey,
  confirmLabel,
  onConfirm,
  onClose,
}) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      wasOpenRef.current = false;
      return;
    }
    if (wasOpenRef.current) return;
    wasOpenRef.current = true;
    setValue(initialValueTranslationKey ? t(initialValueTranslationKey) : initialValue);
    const timeout = setTimeout(() => inputRef.current?.select(), 60);
    return () => clearTimeout(timeout);
  }, [isOpen, initialValue, initialValueTranslationKey, t]);

  const submit = () => {
    const name = value.trim();
    if (name) onConfirm(name);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      accessibleTitle={title}
      className="w-80 max-w-[90vw] [&_h2]:font-sans [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:tracking-normal [&_h2]:[font-stretch:normal]"
    >
      <div className="space-y-3">
        {subtitle && (
          <p className="-mt-2 text-xs text-base-fg/40">{subtitle}</p>
        )}
        <input
          ref={inputRef}
          type="text"
          aria-label={t("Folder name")}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          className="w-full rounded-[3px] border border-ui-panel-border bg-ui-controls/40 px-3 py-1.5 text-sm text-base-fg outline-none focus:ring-1 focus:ring-primary/50"
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <Button
            variant="action"
            onClick={onClose}
            className="px-3 py-1.5 text-[11px]"
          >
            {t("Cancel")}
          </Button>
          <Button
            onClick={submit}
            disabled={!value.trim()}
            className="px-3 py-1.5 text-[11px]"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
