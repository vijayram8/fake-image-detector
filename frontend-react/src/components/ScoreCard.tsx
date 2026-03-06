interface ScoreCardProps {
  title: string;
  score: number;
  subtitle: string;
}

export function ScoreCard({ title, score, subtitle }: ScoreCardProps) {
  const percentage = Math.round(score * 100);
  let color = "text-neutral-400";
  if (score >= 0.65) color = "text-white";
  else if (score >= 0.4) color = "text-neutral-300";

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
      <p className="text-sm text-neutral-500">{title}</p>
      <p className={`text-4xl font-bold ${color}`}>{percentage}%</p>
      <p className="text-xs uppercase tracking-wide text-neutral-500">{subtitle}</p>
      <div className="mt-4 h-2 w-full rounded-full bg-neutral-800">
        <div
          className={`h-full rounded-full bg-gradient-to-r from-neutral-600 to-white`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
