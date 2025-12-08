#!/usr/bin/env bash
set -o errexit

# Upgrade pip and install wheel
pip install --upgrade pip setuptools wheel

# Install packages with pre-built wheels
pip install --no-cache-dir --prefer-binary -r backend-flask/requirements.txt
