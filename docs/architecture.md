# System Architecture

```mermaid
graph TD
  A[React Client] -->|POST /analyze-image| B[Flask API]
  B --> C[AI Classifier (EfficientNet/ViT)]
  B --> D[Manipulation Detector (ManTra-Net)]
  B --> E[Noiseprint++ Analyzer]
  B --> F[EXIF Forensics]
  C -->|ai_score| G[(Analysis Payload)]
  D -->|heatmap + manipulation_score| G
  E -->|consistency score| G
  F -->|metadata flags| G
  G -->|JSON| A
```

## Flow summary

1. **Upload** – React app accepts PNG/JPEG/BMP/TIFF, shows progress UI.
2. **Gateway** – Flask validates size/type, streams file into analysis service.
3. **Inference stack**
   - CNN/Transformer predicts AI-generation probability.
   - ManTra-Net (or alternative) produces spatial heatmaps.
   - Noiseprint++ checks sensor noise inconsistencies.
   - EXIF analyzer extracts metadata and flags anomalies.
4. **Fusion** – Service merges scores, thresholds, metadata findings, and crafts verdict labels.
5. **Response** – Results return as JSON with base64 heatmap for overlay.

## Deployment considerations

- Package backend as a Gunicorn + Flask container behind Nginx.
- Run GPU-serving models via TorchServe or custom FastAPI microservices, communicating over gRPC.
- Cache EXIF + inference outputs using Redis keyed by SHA256 of the image.
- Use message queues (e.g., RabbitMQ) for asynchronous re-analysis when models update.
