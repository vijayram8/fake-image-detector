import type { ImageMetadata, MetadataFlags } from "../types/analysis";

interface MetadataTableProps {
  metadata: ImageMetadata;
  flags?: MetadataFlags;
}

export function MetadataTable({ metadata, flags }: MetadataTableProps) {
  const entries = Object.entries(metadata ?? {});

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">Metadata Forensics</p>
        {flags?.metadata_status === "missing" && (
          <span className="text-xs font-semibold text-amber-300">Metadata missing</span>
        )}
      </div>
      <ul className="mt-4 space-y-2 text-sm text-slate-200">
        {entries.length === 0 && <li className="text-slate-500">No metadata available</li>}
        {entries.map(([key, value]) => (
          <li key={key} className="flex justify-between gap-4">
            <span className="text-slate-400">{key}</span>
            <span className="text-right text-white">{value}</span>
          </li>
        ))}
      </ul>
      {(flags?.software_warning || flags?.camera_warning) && (
        <div className="mt-4 rounded-lg bg-amber-500/10 p-3 text-xs text-amber-200">
          <p className="font-semibold">Warnings</p>
          {flags?.software_warning && <p>Software: {flags.software_warning}</p>}
          {flags?.camera_warning && <p>{flags.camera_warning}</p>}
        </div>
      )}
    </div>
  );
}
