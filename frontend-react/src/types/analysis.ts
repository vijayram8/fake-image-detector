export interface ImageMetadata {
  [key: string]: string;
}

export interface MetadataFlags {
  metadata_status?: string;
  software_warning?: string;
  camera_warning?: string;
}

export interface ImageAnalysisResponse {
  ai_score: number;
  label: string;
  manipulation_score: number;
  heatmap: string; // base64 string
  metadata: ImageMetadata;
  metadata_flags: MetadataFlags;
  verdict: string;
}
