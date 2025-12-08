import { useState } from "react";

interface HeatmapViewerProps {
  originalSrc?: string;
  heatmapBase64?: string;
}

export function HeatmapViewer({ originalSrc, heatmapBase64 }: HeatmapViewerProps) {
  const [showHeatmap, setShowHeatmap] = useState(true);

  const heatmapUrl = heatmapBase64 ? `data:image/png;base64,${heatmapBase64}` : undefined;

  if (!originalSrc) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/30">
        <p className="text-slate-500">Upload an image to preview</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-black/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-100">Heatmap Overlay</p>
        <label className="flex items-center gap-2 text-xs text-white">
          <input
            type="checkbox"
            checked={showHeatmap}
            onChange={(e) => setShowHeatmap(e.target.checked)}
          />
          Show heatmap
        </label>
      </div>
      <div className="relative">
        <img src={originalSrc} alt="Uploaded preview" className="w-full rounded-xl object-contain" />
        {showHeatmap && heatmapUrl && (
          <img
            src={heatmapUrl}
            alt="Manipulation heatmap"
            className="absolute inset-0 w-full rounded-xl object-contain opacity-60 mix-blend-screen"
          />
        )}
      </div>
    </div>
  );
}
