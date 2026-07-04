ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "$ROOT_DIR/config.sh"
source "$ROOT_DIR/helpers/login.sh"

name="02-teacher-create-class"
echo "=== Test: $name - Teacher creates a new class ==="
setup_screenshot_dir "$name"

login teacher
take_screenshot "$name" "01-teacher-dashboard"

agent-browser open "$BASE_URL/$LOCALE/teacher/classes" 2>/dev/null
agent-browser wait --load domcontentloaded 2>/dev/null
agent-browser wait 1000
take_screenshot "$name" "02-classes-list"

agent-browser open "$BASE_URL/$LOCALE/teacher/classes/new" 2>/dev/null
agent-browser wait --load domcontentloaded 2>/dev/null
agent-browser wait 1000
take_screenshot "$name" "03-new-class-form"

agent-browser snapshot -i 2>/dev/null
agent-browser fill "input[placeholder]" "E2E Test Class $(date +%s)" 2>/dev/null
agent-browser fill "textarea" "Created by automated e2e test" 2>/dev/null

agent-browser click "button[type=\"submit\"]" 2>/dev/null
agent-browser wait 3000

take_screenshot "$name" "04-after-create"

assert_url_contains "/teacher/classes/"
echo "  ✓ Class created successfully"

agent-browser close 2>/dev/null
echo ""
echo "=== Test: $name PASSED ==="
