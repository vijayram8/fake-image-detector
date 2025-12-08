import { useCallback, useRef, useState } from "react";

interface UploadPanelProps {
  onFileSelected: (file: File) => void;
  isLoading: boolean;
  error?: string;
}

const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "image/bmp", "image/tiff"];

export function UploadPanel({ onFileSelected, isLoading, error }: UploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files?.length) return;
      const file = files[0];
      if (!ACCEPTED.includes(file.type)) {
        alert("Unsupported file type. Please upload PNG/JPEG/WEBP/BMP/TIFF.");
        return;
      }
      onFileSelected(file);
    },
    [onFileSelected]
  );

  return (
    <section
      className={`rounded-2xl border-2 border-dashed p-6 text-center transition ${
        isDragging ? "border-cyber-500 bg-cyber-900/40" : "border-slate-700 bg-slate-900/40"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer?.files ?? null);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={ACCEPTED.join(",")}
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="text-lg font-semibold text-white">Upload an image</p>
      <p className="text-sm text-slate-300">Drag & drop or click to browse</p>
      <button
        type="button"
        className="mt-4 rounded-full bg-cyber-500 px-5 py-2 font-semibold text-white hover:bg-cyber-600"
        onClick={() => inputRef.current?.click()}
        disabled={isLoading}
      >
        {isLoading ? "Analyzing..." : "Select Image"}
      </button>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </section>
  );
}
