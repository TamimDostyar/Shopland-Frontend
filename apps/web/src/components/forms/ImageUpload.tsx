import { useRef, useState } from "react";
import { CameraIcon } from "../ui/icons";

interface Props {
  label: string;
  accept?: string;
  onChange: (file: File | null) => void;
  error?: string;
}

export default function ImageUpload({
  label,
  accept = "image/*",
  onChange,
  error,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    onChange(file);
    setFileName(file?.name ?? null);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-muted font-medium">{label}</span>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border bg-white shadow-[0_12px_32px_rgba(23,32,51,0.05)] ${
          error ? "border-error" : "border-border"
        } hover:border-accent transition-colors text-left`}
      >
        {preview ? (
          <img
            src={preview}
            alt="preview"
            className="size-11 rounded-xl object-cover shrink-0"
          />
        ) : (
          <div className="size-11 rounded-xl bg-[var(--surface-muted)] text-[color:var(--accent)] flex items-center justify-center shrink-0">
            <CameraIcon size={18} />
          </div>
        )}
        <span className="text-sm text-muted truncate font-medium">
          {fileName ?? "Choose file…"}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={handleChange}
      />
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}
