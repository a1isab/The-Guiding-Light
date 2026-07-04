#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export BASE_URL="${BASE_URL:-http://localhost:3000}"
export LOCALE="${LOCALE:-en}"

source "$ROOT_DIR/config.sh"
source "$ROOT_DIR/helpers/login.sh"

PASSED=0
FAILED=0
FAILED_NAMES=()

run_test() {
  local script="$1"
  local name
  name=$(basename "$script" .sh)
  echo ""
  echo "=================================================================="
  echo "  RUNNING: $name"
  echo "=================================================================="
  echo ""

  if bash "$script" 2>&1; then
    PASSED=$((PASSED + 1))
    echo ""
    echo "  ✔ $name PASSED"
  else
    FAILED=$((FAILED + 1))
    FAILED_NAMES+=("$name")
    echo ""
    echo "  ✘ $name FAILED"
  fi

  echo "=================================================================="
  echo ""
}

echo ""
echo "══════════════════════════════════════════════════════════════════"
echo "  E2E Test Suite — The Guiding Light"
echo "  Base URL: $BASE_URL"
echo "  Locale:   $LOCALE"
echo "══════════════════════════════════════════════════════════════════"
echo ""

SPECS_DIR="$ROOT_DIR/specs"
for script in "$SPECS_DIR"/*.sh; do
  [ -f "$script" ] || continue
  run_test "$script"
done

echo ""
echo "══════════════════════════════════════════════════════════════════"
echo "  RESULTS"
echo "══════════════════════════════════════════════════════════════════"
echo "  Passed: $PASSED"
echo "  Failed: $FAILED"
if [ ${#FAILED_NAMES[@]} -gt 0 ]; then
  echo "  Failed tests:"
  for name in "${FAILED_NAMES[@]}"; do
    echo "    - $name"
  done
fi

echo ""
if [ "$FAILED" -eq 0 ]; then
  echo "  All tests passed!"
  exit 0
else
  echo "  Some tests failed."
  exit 1
fi
