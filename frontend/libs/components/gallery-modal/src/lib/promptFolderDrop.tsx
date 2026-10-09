import {
  showActionReminder,
  isActionReminderOpen,
} from "@storyteller/ui-action-reminder-modal";

export interface FolderDropPromptOptions {
  count: number;
  targetFolderName?: string;
  t: (source: string, params?: Record<string, string | number>) => string;
  onMove: () => void | Promise<void>;
  onAdd: () => void | Promise<void>;
}

/**
 * Ask whether to move items into a folder or add a copy. Used when the items
 * come from another folder (folder → folder). "Move here" removes them from the
 * source; "Add a copy" keeps them in both; the X / backdrop cancels.
 */
export function promptFolderDrop({
  count,
  targetFolderName,
  t,
  onMove,
  onAdd,
}: FolderDropPromptOptions): void {
  const folder = targetFolderName ?? t("the selected folder");
  showActionReminder({
    reminderType: "default",
    title:
      count === 1
        ? t("Move or copy this item?")
        : t("Move or copy {count} items?", { count }),
    message: (
      <p className="text-sm text-white/70">
        {count === 1
          ? t(
              "Moving this item to {folder} removes it from the current folder. Adding a copy keeps it in both.",
              { folder },
            )
          : t(
              "Moving {count} items to {folder} removes them from the current folder. Adding copies keeps them in both.",
              { count, folder },
            )}
      </p>
    ),
    primaryActionText: t("Move here"),
    onPrimaryAction: async () => {
      try {
        await onMove();
      } finally {
        isActionReminderOpen.value = false;
      }
    },
    secondaryActionText: t("Add a copy"),
    onSecondaryAction: async () => {
      try {
        await onAdd();
      } finally {
        isActionReminderOpen.value = false;
      }
    },
  });
}
