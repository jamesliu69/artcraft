import { TagIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "@storyteller/common";
import { PROMO_PCT } from "./promo-discounts";

interface PricingPromoBannerProps {
  className?: string;
}

export const PricingPromoBanner = ({ className }: PricingPromoBannerProps) => {
  const { t } = useTranslation();
  return (
    <div
      className={twMerge(
        "relative overflow-hidden border border-primary/30 bg-gradient-to-r from-primary-600/35 via-primary-500/15 to-primary/10 px-6 py-6 sm:px-10 sm:py-8",
        className,
      )}
    >
    {/* Decorative glow, top-right */}
    <div
      aria-hidden
      className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 bg-primary/25 blur-3xl"
    />

    <div className="relative flex flex-col gap-3">
      <span className="inline-flex w-fit items-center gap-1.5 bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-white">
        <TagIcon  className="text-[10px]" />
        {t("Limited-time offer")}
      </span>

      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight tracking-[-0.02em] text-white">
        {t("Save {percent}% on all monthly and yearly plans", {
          percent: PROMO_PCT,
        })}
      </h2>

      <p className="max-w-2xl text-sm sm:text-base text-white/60">
        {t("Every ArtCraft plan is discounted for a limited time. Lock in the lowest price and start creating.")}
      </p>
    </div>
    </div>
  );
};

export default PricingPromoBanner;
