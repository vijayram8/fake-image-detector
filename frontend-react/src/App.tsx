import { useMemo, useState } from "react";
import { UploadPanel } from "./components/UploadPanel";
import { ScoreCard } from "./components/ScoreCard";
import { MetadataTable } from "./components/MetadataTable";
import { HeatmapViewer } from "./components/HeatmapViewer";
import { ReportCard } from "./components/ReportCard";
import { useImageAnalysis } from "./hooks/useImageAnalysis";
import type { ImageAnalysisResponse } from "./types/analysis";

function formatConfidence(label?: string) {
  switch (label) {
    case "likely_ai":
      return "Likely AI-generated";
    case "uncertain":
      return "Uncertain";
    default:
      return "Likely real";
  }
}

export default function App() {
  const { analyze, data, isLoading, error } = useImageAnalysis();
  const [selectedFileUrl, setSelectedFileUrl] = useState<string>();

  const aiSubtitle = useMemo(() => formatConfidence(data?.label), [data]);

  const handleFileSelected = (file: File) => {
    const url = URL.createObjectURL(file);
    setSelectedFileUrl(url);
    void analyze(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyber-900 to-black p-6 text-white">
      <header className="mx-auto max-w-6xl pb-8">
        <p className="text-sm uppercase tracking-widest text-cyber-200">AI Image Authenticity Analyzer</p>
        <h1 className="text-3xl font-bold">Detect AI-generated, edited & manipulated imagery</h1>
        <p className="mt-2 text-slate-300">
          Upload any photo to receive AI probability, manipulation heatmaps, metadata forensics, and a downloadable report.
        </p>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <UploadPanel onFileSelected={handleFileSelected} isLoading={isLoading} error={error} />
          <ReportCard analysis={data as ImageAnalysisResponse | undefined} />
        </div>
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <ScoreCard title="AI Generation Probability" score={data?.ai_score ?? 0} subtitle={aiSubtitle} />
            <ScoreCard title="Manipulation Probability" score={data?.manipulation_score ?? 0} subtitle="Heatmap-backed estimation" />
          </div>
          <HeatmapViewer originalSrc={selectedFileUrl} heatmapBase64={data?.heatmap} />
          <MetadataTable metadata={data?.metadata ?? {}} flags={data?.metadata_flags} />
        </div>
      </main>
    </div>
  );
}
