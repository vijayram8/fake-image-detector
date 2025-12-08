# API Contract

## POST `/analyze-image`

- **Content-Type:** `multipart/form-data`
- **Body:** `image` field containing PNG/JPG/BMP/TIFF (<=25 MB)

### Response
```json
{
  "ai_score": 0.82,
  "label": "likely_ai",
  "manipulation_score": 0.63,
  "heatmap": "<base64>",
  "metadata": {
    "Camera": "Canon EOS 80D",
    "Software": "Adobe Photoshop"
  },
  "metadata_flags": {
    "software_warning": "Adobe Photoshop"
  },
  "verdict": "Real but AI-edited"
}
```

### Error codes
| Status | Reason |
| --- | --- |
| 400 | Missing file, unsupported extension |
| 413 | Payload too large |
| 500 | Internal inference failure |

## Future endpoints
- `GET /reports/{id}` – Fetch stored analysis summaries.
- `POST /batch-analyze` – Multi-image ingestion for newsroom workflows.
- `WS /stream` – Live video frame scoring.
