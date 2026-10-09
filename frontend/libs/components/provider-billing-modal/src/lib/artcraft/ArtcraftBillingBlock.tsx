import { PricingContent } from "@storyteller/ui-pricing-modal";
import { useTranslation } from "@storyteller/common";

interface ArtcraftBillingBlockProps {
  isVideoPage?: boolean;
}

export function ArtcraftBillingBlock({
  isVideoPage = false,
}: ArtcraftBillingBlockProps) {
  const { t } = useTranslation();
  const title = isVideoPage
    ? t("Video Generation is Resource Intensive")
    : t("Subscribe for Credits to Generate");

  const subtitle = isVideoPage
    ? t("Creating high-quality videos requires significant computing power. To generate more, you can subscribe to ArtCraft or buy ArtCraft credits. You can also add third-party providers and use your existing services. Your support helps us keep building and improving ArtCraft. We are building the image and video tool that you can own forever.")
    : t("To generate more, subscribe to ArtCraft or buy credits. You can also add third-party providers and use your existing services. Your support helps fund open-source development and keeps ArtCraft improving. We are building the creative tool that you can own forever.");

  return (
    <div className="w-full">
      <PricingContent title={title} subtitle={subtitle} />
    </div>
  );
}
