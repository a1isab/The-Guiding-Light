ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "$ROOT_DIR/config.sh"
source "$ROOT_DIR/helpers/login.sh"

name="07-student-join-class"
echo "=== Test: $name - Student joins a class via invite code ==="
setup_screenshot_dir "$name"

login student
take_screenshot "$name" "01-student-dashboard"

INVITE_CODE="${1:-TESTCODE}"

agent-browser fill "input[placeholder*=\"invite code\" i]" "$INVITE_CODE" 2>/dev/null
agent-browser wait 500
take_screenshot "$name" "02-invite-code-filled"

agent-browser find text "Join" click --exact 2>/dev/null
agent-browser wait 5000

take_screenshot "$name" "03-after-join"

assert_url_contains "/join/"
echo "  ✓ Redirected to join page"

agent-browser wait 2000
take_screenshot "$name" "04-join-status"

agent-browser close 2>/dev/null
echo ""
echo "=== Test: $name PASSED ==="
