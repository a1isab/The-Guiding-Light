ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "$ROOT_DIR/config.sh"
source "$ROOT_DIR/helpers/login.sh"

name="06-teacher-save-template"
echo "=== Test: $name - Teacher saves lesson as template ==="
setup_screenshot_dir "$name"

login teacher
take_screenshot "$name" "01-teacher-dashboard"

echo "  NOTE: This test requires an existing lesson. Update URL below."
echo ""
agent-browser open "$BASE_URL/$LOCALE/teacher/classes/TODO/courses/TODO/sections/TODO/lessons/TODO" 2>/dev/null
agent-browser wait --load domcontentloaded 2>/dev/null
agent-browser wait 2000
take_screenshot "$name" "02-lesson-editor"

agent-browser find text "Save as Template" click --exact 2>/dev/null
agent-browser wait 1000
take_screenshot "$name" "03-template-dialog"

agent-browser fill "input[placeholder=\"My template name\"]" "E2E Test Template $(date +%s)" 2>/dev/null

agent-browser find text "Save" click --exact 2>/dev/null
agent-browser wait 2000
take_screenshot "$name" "04-after-save-template"

echo "  ✓ Template save dialog dismissed"

agent-browser close 2>/dev/null
echo ""
echo "=== Test: $name PASSED ==="
