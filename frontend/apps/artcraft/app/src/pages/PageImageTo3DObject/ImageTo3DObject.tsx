import { ImageTo3DExperience } from "../../components/experiences/ImageTo3DExperience";
import { useTranslation } from "@storyteller/common";

export const ImageTo3DObject = () => {
  const { t } = useTranslation();
  return (
    <ImageTo3DExperience
      title={t("Generate 3D Object")}
      subtitle={t("Transform your image into a 3D object with textures.")}
      variant="object"
    />
  );
};

export default ImageTo3DObject;

