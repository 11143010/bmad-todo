#!/bin/bash
# Mirror CI execution locally for debugging
# Usage: ./scripts/ci-local.sh

set -e

echo "🔍 Running CI pipeline locally..."
echo ""

# TypeScript check
echo "📝 Step 1: TypeScript check..."
npm run build || { echo "❌ Build failed"; exit 1; }
echo "✅ Build passed"
echo ""

# Unit tests
echo "🧪 Step 2: Unit tests..."
npm run test:unit -- --run || { echo "❌ Unit tests failed"; exit 1; }
echo "✅ Unit tests passed"
echo ""

# E2E tests (single browser for speed)
echo "🎭 Step 3: E2E tests (chromium only)..."
npm run test:e2e -- --project=chromium || { echo "❌ E2E tests failed"; exit 1; }
echo "✅ E2E tests passed"
echo ""

# Burn-in (reduced iterations)
echo "🔥 Step 4: Burn-in loop (3 iterations)..."
for i in {1..3}; do
  echo "  Iteration $i/3"
  npm run test:e2e -- --project=chromium || { echo "❌ Burn-in failed on iteration $i"; exit 1; }
done
echo "✅ Burn-in passed"
echo ""

echo "=========================================="
echo "✅ Local CI pipeline passed!"
echo "=========================================="
