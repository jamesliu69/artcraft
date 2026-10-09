import { FilterEngineCategories } from "@storyteller/api";
import { useTranslation } from "@storyteller/common";
import { Button } from "@storyteller/ui-button";
interface Props {
  onCancel: () => void;
  onRetry: () => void;
  type: FilterEngineCategories | string;
  errorMessage?: string;
}

export const UploadAssetError = ({
  onCancel,
  onRetry,
  type,
  errorMessage,
}: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <h3>{t("Error in Uploading {type}", { type })}</h3>
      <p>{t(errorMessage ?? "Unknown Error")}</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button onClick={onCancel} variant="secondary">
          {t("Cancel")}
        </Button>
        <Button onClick={onRetry} variant="primary">
          {t("Try again")}
        </Button>
      </div>
    </>
  );
};
