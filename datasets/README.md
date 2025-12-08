# Datasets

Keep raw and processed datasets outside the repository to avoid large binary commits. This directory contains
lightweight pointers, manifests, and scripts for reproduction.

## Structure

- `raw/` – Original sources (e.g., Real FFHQ, Midjourney exports, Photoshop-edited sets).
- `processed/` – Train/val/test splits with resized crops, masks, metadata parquet files.
- `manifests/` – CSV/JSON files describing provenance, licensing, and preprocessing steps.
- `scripts/` – Notebook or Python scripts that generate training-ready datasets.

## Recommended sources

| Type | Dataset | Notes |
| --- | --- | --- |
| Real imagery | Open Images, COCO, Unsplash Lite | Capture camera diversity |
| AI-generated | LAION-Aesthetics, Midjourney export dump | Label with generator + version |
| Manipulated | COVERAGE, CASIA, Defacto Deepfake | Provide ground-truth masks for IoU |

## Checklist before training

1. Ensure class balance between real vs AI vs edited splits.
2. Generate `metadata_summary.json` with EXIF completeness stats.
3. Store heatmap masks as PNGs plus RLE for quick loading.
4. Document augmentation pipeline (color jitter, blur, JPEG compression) inside `scripts/augment.py`.
