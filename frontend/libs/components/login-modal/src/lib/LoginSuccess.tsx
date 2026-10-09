import { CheckIcon } from "lucide-react";
import styles from "./LoginSuccess.module.css";
import { useTranslation } from "@storyteller/common";

export function LoginSuccess({ username }: { username: string }) {
  const { t } = useTranslation();
  return (
    <div className={styles.panel} role="status" aria-live="polite" aria-atomic="true">
      <div className={styles.badge} aria-hidden="true">
        <CheckIcon size={28} strokeWidth={2} />
      </div>
      <h2 className={styles.heading}>
        {t("Logged in as")}{" "}
        <span className={styles.username}>{username}</span>
      </h2>
      <p className={styles.caption}>{t("You're ready to create.")}</p>
    </div>
  );
}
