interface ScoreCardProps {
  title: string;
  score: number;
  subtitle: string;
}

export function ScoreCard({ title, score, subtitle }: ScoreCardProps) {
  const percentage = Math.round(score * 100);
  let color = "text-emerald-400";
  if (score >= 0.65) color = "text-red-400";
  else if (score >= 0.4) color = "text-amber-300";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <p className={`text-4xl font-bold ${color}`}>{percentage}%</p>
      <p className="text-xs uppercase tracking-wide text-slate-400">{subtitle}</p>
      <div className="mt-4 h-2 w-full rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full bg-gradient-to-r from-cyber-500 to-cyber-200`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
