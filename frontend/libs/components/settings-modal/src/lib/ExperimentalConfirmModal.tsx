import { Modal } from "@storyteller/ui-modal";
import { Button } from "@storyteller/ui-button";
import { useTranslation } from "@storyteller/common";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  text: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "primary" | "secondary" | "destructive" | "ghost" | "action";
}

export const ExperimentalConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  text,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "destructive",
}: Props) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t(title)}
      className="max-w-md"
      showClose={false}
    >
      <div className="text-sm text-base-fg">{t(text)}</div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          {t(cancelText)}
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm}>
          {t(confirmText)}
        </Button>
      </div>
    </Modal>
  );
};
