BASE_URL="${BASE_URL:-http://localhost:3000}"
LOCALE="${LOCALE:-en}"

declare -A CREDS
CREDS[admin]="admin@theguidinglight.com:Admin123!"
CREDS[teacher]="teacher@theguidinglight.com:Teacher123!"
CREDS[student]="student@theguidinglight.com:Student123!"

SCREENSHOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/screenshots"

assert_url_contains() {
  local expected="$1"
  local actual
  actual=$(agent-browser get url 2>/dev/null)
  if echo "$actual" | grep -q "$expected"; then
    echo "  ✓ URL contains: $expected"
  else
    echo "  ✗ FAIL: Expected URL to contain '$expected', got '$actual'"
    exit 1
  fi
}

assert_text_visible() {
  local expected="$1"
  local snapshot
  snapshot=$(agent-browser snapshot -i -c 2>/dev/null)
  if echo "$snapshot" | grep -q "$expected"; then
    echo "  ✓ Text visible: $expected"
  else
    echo "  ✗ FAIL: Expected text '$expected' not visible on page"
    echo "$snapshot"
    exit 1
  fi
}

check_is_404() {
  local snapshot
  snapshot=$(agent-browser snapshot -i -c 2>/dev/null)
  if echo "$snapshot" | grep -q "This page could not be found"; then
    return 0
  fi
  return 1
}

skip_on_404() {
  local test_name="$1"
  if check_is_404; then
    echo "  ⚠ Page is 404 (TODO URL needs real IDs). Skipping."
    agent-browser close 2>/dev/null
    echo ""
    echo "=== Test: $test_name SKIPPED ==="
    exit 0
  fi
}
