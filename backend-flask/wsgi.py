from app import create_app
import sys
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = create_app()
application = app  # For WSGI servers

if __name__ == "__main__":
    try:
        from waitress import serve
        port = int(os.environ.get("PORT", 5000))
        host = '0.0.0.0'  # Listen on all interfaces for deployment
        print(f" * Starting Flask server with Waitress on {host}:{port}", flush=True)
        logger.info(f"Starting production server on port {port}...")
        serve(app, host=host, port=port, threads=4)
    except KeyboardInterrupt:
        print("\nShutting down...", flush=True)
        sys.exit(0)
    except Exception as e:
        logger.error(f"Fatal error: {e}", exc_info=True)
        sys.exit(1)
