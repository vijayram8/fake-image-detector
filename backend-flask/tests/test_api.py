import io

from PIL import Image

from app import create_app


def _create_test_image() -> io.BytesIO:
    img = Image.new("RGB", (32, 32), color=(200, 100, 50))
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    return buffer


def test_health_endpoint():
    app = create_app()
    client = app.test_client()

    response = client.get("/health")
    assert response.status_code == 200
    assert response.json["status"] == "ok"


def test_analyze_image_requires_file():
    app = create_app()
    client = app.test_client()

    response = client.post("/analyze-image")
    assert response.status_code == 400


def test_analyze_image_happy_path():
    app = create_app()
    client = app.test_client()

    data = {
        "image": (_create_test_image(), "test.png"),
    }
    response = client.post("/analyze-image", data=data, content_type="multipart/form-data")

    assert response.status_code == 200
    json_data = response.get_json()
    assert "ai_score" in json_data
    assert "manipulation_score" in json_data
    assert "metadata" in json_data
    assert "noise_score" in json_data
    assert "heatmap" in json_data
