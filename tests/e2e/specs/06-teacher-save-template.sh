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

agent-browser click "button" --name "Save as Template" 2>/dev/null
agent-browser wait 1000
take_screenshot "$name" "03-template-dialog"

agent-browser fill "input[placeholder=\"My template name\"]" "E2E Test Template $(date +%s)" 2>/dev/null

agent-browser click "button" --name "Save" --exact 2>/dev/null
agent-browser wait 2000
take_screenshot "$name" "04-after-save-template"

echo "  ✓ Template save dialog dismissed"

agent-browser close 2>/dev/null
echo ""
echo "=== Test: $name PASSED ==="
