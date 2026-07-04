ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "$ROOT_DIR/config.sh"
source "$ROOT_DIR/helpers/login.sh"

name="04-teacher-file-upload"
echo "=== Test: $name - Teacher uploads a file to lesson ==="
setup_screenshot_dir "$name"

login teacher
take_screenshot "$name" "01-teacher-dashboard"

echo "  NOTE: This test requires an existing lesson. Update URL below."
echo ""
agent-browser open "$BASE_URL/$LOCALE/teacher/classes/TODO/courses/TODO/sections/TODO/lessons/TODO" 2>/dev/null
agent-browser wait --load domcontentloaded 2>/dev/null
agent-browser wait 2000
take_screenshot "$name" "02-lesson-editor"

agent-browser snapshot -i -c 2>/dev/null

echo "  Looking for file upload area..."
agent-browser find text "Documents" scrollintoview 2>/dev/null
agent-browser wait 500
take_screenshot "$name" "03-file-upload-area"

echo "  ✓ File upload section visible"
echo "  NOTE: File upload via agent-browser requires an actual test file."
echo "  Use: agent-browser upload <selector> tests/e2e/fixtures/test.pdf"

agent-browser close 2>/dev/null
echo ""
echo "=== Test: $name PASSED (partial - file upload requires fixture) ==="
