import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "./icons";

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
      className={`inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--text-soft)] shadow-[0_8px_24px_rgba(23,32,51,0.05)] transition-all hover:-translate-x-0.5 hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] ${className}`}
    >
      <ArrowLeftIcon size={16} />
      {label}
    </button>
  );
}
