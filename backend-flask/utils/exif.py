"""EXIF extraction helpers."""

from __future__ import annotations

from typing import BinaryIO, Dict

from PIL import Image, ExifTags


SUSPICIOUS_SOFTWARE = {"adobe", "photoshop", "unknown"}


def extract_metadata(image_stream: BinaryIO) -> Dict[str, str]:
    try:
        image_stream.seek(0)
        with Image.open(image_stream) as img:
            exif_data = img.getexif()
    except Exception:
        return {"warning": "Failed to parse EXIF metadata"}

    if not exif_data:
        return {"warning": "No EXIF metadata detected"}

    readable = {}
    for tag_id, value in exif_data.items():
        tag = ExifTags.TAGS.get(tag_id, tag_id)
        if isinstance(value, bytes):
            try:
                value = value.decode()
            except Exception:  # pragma: no cover
                continue
        readable[str(tag)] = str(value)
    return readable


def flag_metadata(metadata: Dict[str, str]) -> Dict[str, str]:
    findings = {}
    software = metadata.get("Software", "").lower()
    camera = metadata.get("Model")

    if not metadata:
        findings["metadata_status"] = "missing"
    if any(sw in software for sw in SUSPICIOUS_SOFTWARE):
        findings["software_warning"] = metadata.get("Software", "Unknown software")
    if not camera:
        findings["camera_warning"] = "Camera model unavailable"

    return findings
