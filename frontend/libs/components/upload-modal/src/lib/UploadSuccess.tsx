import {
  Button
} from "@storyteller/ui-button"
import { useTranslation } from "@storyteller/common";

interface Props {
  title: string;
  onOk: () => void;
}

export const UploadSuccess = ({ title, onOk }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="w-100 text-center opacity-50">
        {t("Added {title} to your library", { title: t(title) })}
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button onClick={onOk} variant="primary">
          {t("OK")}
        </Button>
      </div>
    </>
  );
};
