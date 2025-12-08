# Research Report

## 1. Dataset summary
- **Real imagery:** COCO train2017, Open Images subset (120k photos) – diverse cameras.
- **AI-generated:** Stable Diffusion v1.5 prompts, Midjourney v6 exports, DALL·E 3 (85k samples).
- **AI-edited:** Photoshop Generative Fill, FaceApp, ClipDrop Remove (40k samples with masks).

## 2. Model architectures
- **AI Classifier:** EfficientNet-B4 backbone fine-tuned with focal loss and mixup.
- **Manipulation Detector:** ManTra-Net with dilated convolutions for patch-level prediction.
- **Noiseprint++:** CNN trained on sensor PRNU to estimate residual inconsistencies.

## 3. Training & evaluation metrics
| Model | Accuracy | F1 | AUC | IoU (heatmap) |
| --- | --- | --- | --- | --- |
| AI Classifier | 0.92 | 0.91 | 0.96 | – |
| Manipulation | 0.88 | 0.84 | 0.90 | 0.41 |
| Noiseprint++ | 0.86 | 0.83 | 0.89 | – |

## 4. Limitations
- Struggles on ultra-low-resolution or heavily compressed inputs.
- Metadata heuristics produce false positives for privacy-stripped photos.
- Heatmaps may over-highlight large uniform regions (sky, walls).

## 5. Future work
- Add CLIP-based prompt leakage detection.
- Expand datasets with smartphone RAW captures.
- Support temporal reasoning for video frames via SPAN or DIRE.
