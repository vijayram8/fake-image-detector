from typing import Iterable

ALLOWED_EXTENSIONS: Iterable[str] = {"png", "jpg", "jpeg", "bmp", "tiff", "webp"}


def allowed_file(filename: str) -> bool:
    if "." not in filename:
        return False
    ext = filename.rsplit(".", 1)[1].lower()
    return ext in ALLOWED_EXTENSIONS
