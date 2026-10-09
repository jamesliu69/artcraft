import { Button } from "@storyteller/ui-button";
import { Modal } from "@storyteller/ui-modal";
import { ReactNode } from "react";
import { LogInIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "@storyteller/common";

export type ReminderType = "default" | "soraLogin" | "artcraftLogin";

interface ActionReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminderType?: ReminderType;
  onPrimaryAction: () => void;
  title?: string;
  hideTitle?: boolean;
  message?: ReactNode;
  children?: ReactNode;
  primaryActionText?: string;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  isLoading?: boolean;
  openAiLogo?: string;
  modalClassName?: string;
  primaryActionIcon?: LucideIcon;
  primaryActionBtnClassName?: string;
}

export function ActionReminderModal({
  isOpen,
  onClose,
  reminderType = "default",
  onPrimaryAction,
  title: customTitle,
  hideTitle = false,
  message: customMessage,
  children: customChildren,
  primaryActionText: customPrimaryActionText,
  secondaryActionText: customSecondaryActionText,
  onSecondaryAction,
  isLoading = false,
  modalClassName: customModalClassName = "",
  primaryActionIcon: customPrimaryActionIcon = LogInIcon,
  primaryActionBtnClassName: customPrimaryActionBtnClassName = "",
}: ActionReminderModalProps) {
  const { t } = useTranslation();
  const localizedCustomMessage =
    typeof customMessage === "string" ? t(customMessage) : customMessage;
  let titleText: string | undefined;
  let messageContent: ReactNode;
  let primaryActionBtnText: string;
  let primaryActionIcon = LogInIcon;
  let primaryActionBtnClassName = "";

  if (!hideTitle) {
    switch (reminderType) {
      case "soraLogin":
        titleText = t(customTitle || "Link Your OpenAI Sora Account");
        break;
      case "artcraftLogin":
        titleText = t(customTitle || "Login to ArtCraft");
        break;
      default:
        titleText = t(customTitle || "Action Required");
        break;
    }
  } else {
    titleText = undefined;
  }

  switch (reminderType) {
    case "soraLogin":
      titleText = t(customTitle || "Link Your OpenAI Account");
      messageContent = localizedCustomMessage || (
        <p>
          {t("To use this feature, please connect your OpenAI account. This lets you use your existing subscription.")}
        </p>
      );
      primaryActionBtnText = t(customPrimaryActionText || "Login with OpenAI");
      primaryActionIcon = customPrimaryActionIcon || LogInIcon;
      primaryActionBtnClassName = customPrimaryActionBtnClassName || "";
      break;
    case "artcraftLogin":
      messageContent = localizedCustomMessage || (
        <p className="text-sm text-white/70">
          {t("Please log in or sign up to ArtCraft to proceed. This will let you save your work and access all features.")}
        </p>
      );
      primaryActionBtnText = t(customPrimaryActionText || "Login / Sign Up");
      primaryActionIcon = customPrimaryActionIcon || LogInIcon;
      primaryActionBtnClassName = customPrimaryActionBtnClassName || "";
      break;
    default:
      messageContent = localizedCustomMessage || (
        <p className="text-sm text-white/70">
          {t("Please complete the required action.")}
        </p>
      );
      primaryActionBtnText = t(customPrimaryActionText || "Proceed");
      primaryActionIcon = customPrimaryActionIcon || LogInIcon;
      primaryActionBtnClassName = customPrimaryActionBtnClassName || "";
      break;
  }

  const effectiveSecondaryAction = onSecondaryAction || onClose;
  const effectiveSecondaryActionText = t(customSecondaryActionText || "Cancel");

  let modalSpecificClasses = "";

  const finalModalClassName =
    `${customModalClassName} ${modalSpecificClasses}`.trim();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={titleText}
      className={finalModalClassName}
    >
      <div>
        {customChildren ? (
          <div className="space-y-4">{customChildren}</div>
        ) : (
          <div className="space-y-4">{messageContent}</div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row-reverse gap-3">
          <Button
            onClick={onPrimaryAction}
            loading={isLoading}
            disabled={isLoading}
            icon={primaryActionIcon}
            className={twMerge("w-full sm:w-auto", primaryActionBtnClassName)}
          >
            {primaryActionBtnText}
          </Button>
          {(onSecondaryAction || customSecondaryActionText) && (
            <Button
              variant="secondary"
              onClick={effectiveSecondaryAction}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {effectiveSecondaryActionText}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default ActionReminderModal;
