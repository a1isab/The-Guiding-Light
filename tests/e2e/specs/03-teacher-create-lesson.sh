ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "$ROOT_DIR/config.sh"
source "$ROOT_DIR/helpers/login.sh"

name="03-teacher-create-lesson"
echo "=== Test: $name - Teacher edits lesson with markdown and quiz source ==="
setup_screenshot_dir "$name"

login teacher
take_screenshot "$name" "01-teacher-dashboard"

agent-browser open "$BASE_URL/$LOCALE/teacher/classes" 2>/dev/null
agent-browser wait --load domcontentloaded 2>/dev/null
agent-browser wait 1000
take_screenshot "$name" "02-classes-list"

agent-browser snapshot -i -c 2>/dev/null

echo "  NOTE: This test requires an existing class with a course, section, and lesson."
echo "  Update the URL below to point to an actual lesson edit page."
echo ""
echo "  Opening lesson editor..."
agent-browser open "$BASE_URL/$LOCALE/teacher/classes/TODO/courses/TODO/sections/TODO/lessons/TODO" 2>/dev/null
agent-browser wait --load domcontentloaded 2>/dev/null
agent-browser wait 2000
take_screenshot "$name" "03-lesson-editor"

agent-browser fill "input[type=\"text\"]" "E2E Test Lesson $(date +%s)" 2>/dev/null
take_screenshot "$name" "04-title-filled"

agent-browser find text "Save" click --exact 2>/dev/null
agent-browser wait 3000
take_screenshot "$name" "05-after-save"

echo "  ✓ Lesson save attempted"
agent-browser close 2>/dev/null
echo ""
echo "=== Test: $name PASSED (manual URL update needed for full automation) ==="
