#!/bin/bash

# Exit on error
set -e

# Change to script directory (project root)
cd "$(dirname "$0")"

echo "[1/3] Installing deps (if needed)..."
pnpm install

echo "[2/3] Building site..."
pnpm build

echo "[3/3] Serving dist on http://0.0.0.0:8024 ..."
npx --yes serve dist -l tcp://0.0.0.0:8024

