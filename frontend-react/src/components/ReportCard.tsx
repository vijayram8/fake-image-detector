import type { ImageAnalysisResponse } from "../types/analysis";

interface ReportCardProps {
  analysis?: ImageAnalysisResponse;
}

export function ReportCard({ analysis }: ReportCardProps) {
  if (!analysis) {
    return (
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 text-center text-neutral-500">
        Upload an image to view the forensic verdict.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 text-white">
      <h3 className="text-lg font-semibold text-white">Verdict</h3>
      <p className="mt-1 text-2xl font-bold text-white">{analysis.verdict}</p>
      <p className="mt-4 text-sm text-neutral-400">
        AI score {Math.round(analysis.ai_score * 100)}% · Manipulation score {Math.round(analysis.manipulation_score * 100)}%
      </p>
      <button
        type="button"
        className="mt-6 rounded-full border border-white px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
        onClick={() => window.print()}
      >
        Download report
      </button>
    </div>
  );
}
