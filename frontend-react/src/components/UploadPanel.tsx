import { useCallback, useRef, useState } from "react";

interface UploadPanelProps {
  onFileSelected: (file: File) => void;
  isLoading: boolean;
  error?: string;
  progress?: string;
}

const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "image/bmp", "image/tiff"];
const MAX_SIZE_MB = 5;
const MAX_DIMENSION = 1024; // Reduced for faster processing on free tier

// Compress image for faster upload on mobile
async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    // Skip non-image files
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let { width, height } = img;
      
      // Always scale down large images for faster processing
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressed = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' });
            console.log(`Compressed: ${(file.size/1024/1024).toFixed(2)}MB → ${(compressed.size/1024/1024).toFixed(2)}MB`);
            resolve(compressed);
          } else {
            resolve(file);
          }
        },
        'image/jpeg',
        0.8 // More compression
      );
    };

    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });
}

export function UploadPanel({ onFileSelected, isLoading, error, progress }: UploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;
      const file = files[0];
      if (!ACCEPTED.includes(file.type)) {
        alert("Unsupported file type. Please upload PNG/JPEG/WEBP/BMP/TIFF.");
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        // Try to compress instead of rejecting
        const compressed = await compressImage(file);
        if (compressed.size > MAX_SIZE_MB * 1024 * 1024) {
          alert(`File too large. Please upload an image smaller than ${MAX_SIZE_MB}MB.`);
          return;
        }
        onFileSelected(compressed);
        return;
      }
      // Compress for faster upload
      const optimized = await compressImage(file);
      onFileSelected(optimized);
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
        className="mt-4 rounded-full bg-cyber-500 px-5 py-2 font-semibold text-white hover:bg-cyber-600 disabled:opacity-50"
        onClick={() => inputRef.current?.click()}
        disabled={isLoading}
      >
        {isLoading ? "Analyzing..." : "Select Image"}
      </button>
      {isLoading && progress && (
        <p className="mt-3 text-sm text-cyber-300 animate-pulse">{progress}</p>
      )}
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </section>
  );
}
