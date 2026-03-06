import type { ImageMetadata, MetadataFlags } from "../types/analysis";

interface MetadataTableProps {
  metadata: ImageMetadata;
  flags?: MetadataFlags;
}

export function MetadataTable({ metadata, flags }: MetadataTableProps) {
  const entries = Object.entries(metadata ?? {});

  return (
    <div className="metadata-table rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">Metadata Forensics</p>
        {flags?.metadata_status === "missing" && (
          <span className="text-xs font-semibold text-neutral-400">Metadata missing</span>
        )}
      </div>
      <ul className="mt-4 space-y-2 text-sm text-neutral-300">
        {entries.length === 0 && <li className="text-neutral-500">No metadata available</li>}
        {entries.map(([key, value]) => (
          <li key={key} className="flex justify-between gap-4">
            <span className="text-neutral-500">{key}</span>
            <span className="text-right text-white">{value}</span>
          </li>
        ))}
      </ul>
      {(flags?.software_warning || flags?.camera_warning) && (
        <div className="mt-4 rounded-lg bg-neutral-800/50 p-3 text-xs text-neutral-300">
          <p className="font-semibold">Warnings</p>
          {flags?.software_warning && <p>Software: {flags.software_warning}</p>}
          {flags?.camera_warning && <p>{flags.camera_warning}</p>}
        </div>
      )}
    </div>
  );
}
