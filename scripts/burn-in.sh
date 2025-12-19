#!/bin/bash
# Burn-in loop for flaky test detection
# Usage: ./scripts/burn-in.sh [iterations] [project]
# Example: ./scripts/burn-in.sh 10 chromium

set -e

ITERATIONS=${1:-10}
PROJECT=${2:-chromium}

echo "🔥 Starting burn-in loop"
echo "   Iterations: $ITERATIONS"
echo "   Project: $PROJECT"
echo ""

for i in $(seq 1 $ITERATIONS); do
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🔥 Iteration $i/$ITERATIONS"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  npm run test:e2e -- --project=$PROJECT || {
    echo ""
    echo "❌ FLAKY TEST DETECTED on iteration $i"
    echo "   Check test-results/ for failure artifacts"
    exit 1
  }
done

echo ""
echo "=========================================="
echo "✅ All $ITERATIONS iterations passed!"
echo "   Tests are stable."
echo "=========================================="
