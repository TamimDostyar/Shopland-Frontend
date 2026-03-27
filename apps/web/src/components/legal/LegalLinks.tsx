import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

interface LegalLinksProps {
  className?: string;
  linkClassName?: string;
  separatorClassName?: string;
}

export default function LegalLinks({
  className = "",
  linkClassName = "",
  separatorClassName = "",
}: LegalLinksProps) {
  const { t } = useLanguage();

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`.trim()}>
      <Link
        to="/privacy"
        className={`text-sm font-medium text-[color:var(--text-soft)] transition-colors hover:text-[color:var(--accent)] ${linkClassName}`.trim()}
      >
        {t("footer.privacy")}
      </Link>
      <span className={`text-[color:var(--border-strong, var(--border))] ${separatorClassName}`.trim()}>
        •
      </span>
      <Link
        to="/terms"
        className={`text-sm font-medium text-[color:var(--text-soft)] transition-colors hover:text-[color:var(--accent)] ${linkClassName}`.trim()}
      >
        {t("footer.terms")}
      </Link>
    </div>
  );
}
