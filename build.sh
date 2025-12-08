#!/usr/bin/env bash
# exit on error
set -o errexit

pip install --upgrade pip
pip install --no-cache-dir -r backend-flask/requirements.txt
