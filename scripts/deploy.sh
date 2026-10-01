#!/bin/bash
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="$ROOT_DIR/dist/lari-app/browser"

echo "Building production bundle with base-href /S2/..."
(
  cd "$ROOT_DIR"
  npx ng build --base-href /S2/
)

echo "Creating 404.html fallback and .nojekyll..."
cp "$DIST_DIR/index.html" "$DIST_DIR/404.html"
touch "$DIST_DIR/.nojekyll"

echo "Preparing deploy commit in dist..."
(
  cd "$DIST_DIR"
  rm -rf .git
  git init -b main
  git config user.name "Gustavo de Souza"
  git config user.email "gudesouza.sz@gmail.com"
  git remote add origin https://github.com/site-lari/S2.git
  git add -A
  git commit -m "deploy: update GitHub Pages production build"

  echo "Pushing to origin/main..."
  git push origin main --force
  rm -rf .git
)

echo "Successfully deployed to https://site-lari.github.io/S2/ !"
