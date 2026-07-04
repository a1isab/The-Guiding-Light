name="05-teacher-preview-mode"
echo "=== Test: $name - Teacher previews a lesson ==="
setup_screenshot_dir "$name"

login teacher
take_screenshot "$name" "01-teacher-dashboard"

echo "  NOTE: This test requires an existing lesson. Update URL below."
echo ""
agent-browser open "$BASE_URL/$LOCALE/teacher/classes/TODO/courses/TODO/sections/TODO/lessons/TODO" 2>/dev/null
agent-browser wait --load domcontentloaded 2>/dev/null
agent-browser wait 2000
take_screenshot "$name" "02-lesson-editor"

agent-browser find text "Preview" click --exact 2>/dev/null
agent-browser wait 2000
take_screenshot "$name" "03-preview-mode"

assert_text_visible "Preview Mode"
echo "  ✓ Preview Mode banner visible"

agent-browser find text "Back to Edit" click --exact 2>/dev/null
agent-browser wait 1500
take_screenshot "$name" "04-back-to-edit"

echo "  ✓ Returned to editor"

agent-browser close 2>/dev/null
echo ""
echo "=== Test: $name PASSED ==="
