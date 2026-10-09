import { ImageTo3DExperience } from "../../components/experiences/ImageTo3DExperience";
import { useTranslation } from "@storyteller/common";

export const ImageTo3DWorld = () => {
  const { t } = useTranslation();
  return (
    <ImageTo3DExperience
      title={t("Image to 3D World")}
      subtitle={t("Generate 3D worlds from an image with World Labs")}
      variant="world"
    />
  );
};

export default ImageTo3DWorld;
