import { useNavigate } from "react-router-dom";

interface Props {
  to?: string;
  label?: string;
  className?: string;
}

export default function BackButton({ to, label = "Back", className = "" }: Props) {
  const navigate = useNavigate();

  function handleClick() {
    if (to) navigate(to);
    else navigate(-1);
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 text-sm font-medium transition-all hover:-translate-x-0.5 ${className}`}
      style={{ color: "var(--text-soft)" }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--accent)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-soft)")}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 12H5" />
        <path d="m12 5-7 7 7 7" />
      </svg>
      {label}
    </button>
  );
}
